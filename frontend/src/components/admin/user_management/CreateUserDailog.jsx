import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin, Shield } from 'lucide-react';

// Validation schema
const createUserSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .required('Full name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  role: Yup.string()
    .oneOf(['User', 'Guide'], 'Please select a valid role')
    .required('Role is required'),
  phone: Yup.string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .optional(),
  address: Yup.string()
    .max(200, 'Address must be less than 200 characters')
    .optional(),
});

// Custom field wrapper
const FormField = ({ label, required = false, error, children, icon: Icon }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-gray-500" />}
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
    {children}
    {error && <div className="text-red-500 text-sm flex items-center gap-1">
      <div className="w-1 h-1 bg-red-500 rounded-full"></div>
      {error}
    </div>}
  </div>
);

// Password strength indicator
const PasswordStrength = ({ password }) => {
  const getStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z\d]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(password);
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i < strength ? colors[strength - 1] : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-600">
        Password strength: <span className={`font-medium ${strength > 2 ? 'text-green-600' : 'text-orange-600'}`}>
          {labels[strength - 1] || 'Very Weak'}
        </span>
      </p>
    </div>
  );
};

export function CreateUserDialog({ open, onOpenChange, onCreate, isLoading = false }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'User',
    phone: '',
    address: '',
    isGuide: false,
  };

  const handleSubmit = async (values, { setSubmitting, setStatus, resetForm }) => {
    try {
      setStatus(null);
      
      // Remove confirmPassword from the data sent to API
      const { confirmPassword, ...userData } = values;
      
      await onCreate(userData);
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create user:', error);
      setStatus({
        type: 'error',
        message: error.message || 'Failed to create user. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = (resetForm) => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <User className="w-5 h-5" />
            Add New User
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Create a new user account for the HikeHub platform. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={createUserSchema}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ 
            values, 
            errors, 
            touched, 
            handleChange, 
            handleBlur, 
            setFieldValue, 
            isSubmitting,
            resetForm,
            status 
          }) => (
            <Form className="space-y-6" noValidate>
              {/* Display form-level errors */}
              {status?.type === 'error' && (
                <Alert variant="destructive">
                  <AlertDescription>{status.message}</AlertDescription>
                </Alert>
              )}

              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField 
                    label="Full Name" 
                    required 
                    error={touched.name && errors.name}
                    icon={User}
                  >
                    <Input
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={touched.name && errors.name ? 'border-red-500' : ''}
                      placeholder="Enter full name"
                      disabled={isSubmitting}
                    />
                  </FormField>

                  <FormField 
                    label="Email Address" 
                    required 
                    error={touched.email && errors.email}
                    icon={Mail}
                  >
                    <Input
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={touched.email && errors.email ? 'border-red-500' : ''}
                      placeholder="Enter email address"
                      disabled={isSubmitting}
                    />
                  </FormField>
                </div>

                <FormField 
                  label="Phone Number" 
                  error={touched.phone && errors.phone}
                  icon={Phone}
                >
                  <Input
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={touched.phone && errors.phone ? 'border-red-500' : ''}
                    placeholder="Enter phone number (optional)"
                    disabled={isSubmitting}
                  />
                </FormField>

                <FormField 
                  label="Address" 
                  error={touched.address && errors.address}
                  icon={MapPin}
                >
                  <Textarea
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={touched.address && errors.address ? 'border-red-500' : ''}
                    placeholder="Enter full address (optional)"
                    rows={3}
                    disabled={isSubmitting}
                  />
                </FormField>
              </div>

              {/* Security Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Security
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField 
                    label="Password" 
                    required 
                    error={touched.password && errors.password}
                    icon={Lock}
                  >
                    <div className="relative">
                      <Input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={touched.password && errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                        placeholder="Enter password"
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSubmitting}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <PasswordStrength password={values.password} />
                  </FormField>

                  <FormField 
                    label="Confirm Password" 
                    required 
                    error={touched.confirmPassword && errors.confirmPassword}
                    icon={Lock}
                  >
                    <div className="relative">
                      <Input
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={touched.confirmPassword && errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                        placeholder="Confirm password"
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isSubmitting}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </FormField>
                </div>
              </div>

              {/* Account Settings Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Account Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField 
                    label="Role" 
                    required 
                    error={touched.role && errors.role}
                  >
                    <Select
                      value={values.role}
                      onValueChange={(value) => {
                        setFieldValue('role', value);
                        setFieldValue('isGuide', value === 'Guide');
                      }}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={touched.role && errors.role ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="User">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            User
                          </div>
                        </SelectItem>
                        <SelectItem value="Guide">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Guide
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Switch
                      id="guide-status"
                      checked={values.isGuide}
                      onCheckedChange={(checked) => {
                        setFieldValue('isGuide', checked);
                        setFieldValue('role', checked ? 'Guide' : 'User');
                      }}
                      disabled={isSubmitting}
                    />
                    <div className="flex flex-col">
                      <Label htmlFor="guide-status" className="text-sm font-medium cursor-pointer">
                        Certified Guide
                      </Label>
                      <p className="text-xs text-gray-600">
                        Enable additional guide privileges
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => handleCancel(resetForm)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || isLoading}
                  className="min-w-[140px]"
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 mr-2" />
                      Create User
                    </>
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}