import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useUpdateUserProfile } from '../../hooks/useUserProfile';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const profileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  phone: Yup.string().optional(),
  hikerType: Yup.string().oneOf(['new', 'experienced']).required('Hiker type is required'),
  bio: Yup.string().max(300, 'Bio cannot be longer than 300 characters').optional(),
  emergencyContactName: Yup.string().optional(),
  emergencyContactPhone: Yup.string().optional(),
});

export function EditProfileDialog({ user, isOpen, onOpenChange }) {
  const { mutate: updateUser, isPending } = useUpdateUserProfile();

  const formik = useFormik({
    initialValues: {
      name: user.name || '',
      phone: user.phone || '',
      hikerType: user.hikerType || 'new',
      bio: user.bio || '',
      emergencyContactName: user.emergencyContact?.name || '',
      emergencyContactPhone: user.emergencyContact?.phone || '',
    },
    validationSchema: profileSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const updatedData = {
        name: values.name,
        phone: values.phone,
        hikerType: values.hikerType,
        bio: values.bio,
        emergencyContact: {
          name: values.emergencyContactName,
          phone: values.emergencyContactPhone,
        },
      };
      updateUser(updatedData, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Your Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" {...formik.getFieldProps('name')} className="col-span-3" />
              {formik.touched.name && formik.errors.name ? <div className="col-start-2 col-span-3 text-red-500 text-sm">{formik.errors.name}</div> : null}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">Phone</Label>
              <Input id="phone" {...formik.getFieldProps('phone')} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hikerType" className="text-right">Hiker Type</Label>
              <Select onValueChange={(value) => formik.setFieldValue('hikerType', value)} defaultValue={formik.values.hikerType}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select hiker type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="experienced">Experienced</SelectItem>
                  </SelectContent>
              </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">About Me</Label>
              <Textarea id="bio" {...formik.getFieldProps('bio')} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="emergencyContactName" className="text-right">Emergency Contact Name</Label>
              <Input id="emergencyContactName" {...formik.getFieldProps('emergencyContactName')} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="emergencyContactPhone" className="text-right">Emergency Contact Phone</Label>
              <Input id="emergencyContactPhone" {...formik.getFieldProps('emergencyContactPhone')} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}