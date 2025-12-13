import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Import your UI components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Enhanced validation schema with better validation rules
const editUserSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .required('Full name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  role: Yup.string()
    .oneOf(['User', 'Guide'], 'Please select a valid role')
    .required('Role is required'),
  status: Yup.string()
    .oneOf(['Active', 'Suspended'], 'Please select a valid status')
    .required('Status is required'),
  phone: Yup.string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .optional(),
  address: Yup.string()
    .max(200, 'Address must be less than 200 characters')
    .optional(),
});

// Custom error display component
const FormError = ({ name, className = "" }) => (
  <ErrorMessage name={name}>
    {msg => <div className={`text-red-500 text-sm mt-1 ${className}`}>{msg}</div>}
  </ErrorMessage>
);

// Custom field wrapper for consistent styling
const FormField = ({ label, required = false, error, children }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
    {children}
    {error && <div className="text-red-500 text-sm">{error}</div>}
  </div>
);

export function EditUserDialog({ open, onOpenChange, user, onUpdate, isLoading = false }) {
  
  const handleUpdateSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      setStatus(null); // Clear any previous errors
      
      if (!user?._id) {
        throw new Error('User ID is required for update');
      }
      
      await onUpdate(user._id, values);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update user:', error);
      setStatus({ 
        type: 'error', 
        message: error.message || 'Failed to update user. Please try again.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = (resetForm) => {
    resetForm();
    onOpenChange(false);
  };

  // Don't render if no user data
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit User: {user.name}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Update user information and settings. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={{
            name: user.name || '',
            email: user.email || '',
            role: user.role || 'User',
            status: user.status || 'Active',
            phone: user.phone || '',
            address: user.address || '',
          }}
          validationSchema={editUserSchema}
          onSubmit={handleUpdateSubmit}
          enableReinitialize={true}
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
                <h3 className="text-lg font-medium border-b pb-2">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField 
                    label="Full Name" 
                    required 
                    error={touched.name && errors.name}
                  >
                    <Input
                      id="edit-name"
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
                  >
                    <Input
                      id="edit-email"
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
                >
                  <Input
                    id="edit-phone"
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
                >
                  <Textarea
                    id="edit-address"
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={touched.address && errors.address ? 'border-red-500' : ''}
                    placeholder="Enter address (optional)"
                    rows={3}
                    disabled={isSubmitting}
                  />
                </FormField>
              </div>

              {/* Account Settings Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Account Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField 
                    label="Role" 
                    required 
                    error={touched.role && errors.role}
                  >
                    <Select
                      value={values.role}
                      onValueChange={(value) => setFieldValue('role', value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={touched.role && errors.role ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="User">User</SelectItem>
                        <SelectItem value="Guide">Guide</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField 
                    label="Status" 
                    required 
                    error={touched.status && errors.status}
                  >
                    <Select
                      value={values.status}
                      onValueChange={(value) => setFieldValue('status', value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={touched.status && errors.status ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Active
                          </div>
                        </SelectItem>
                        <SelectItem value="Suspended">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                            Suspended
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
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
                  className="min-w-[120px]"
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    'Update User'
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