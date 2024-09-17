import { FC, useState } from 'react';
import { Input, Button, Checkbox, Card, Spacer } from '@nextui-org/react';
import { db } from '@/config/firebase'; // Adjust the path as necessary
import { collection, addDoc } from 'firebase/firestore';

const AdmissionForm: FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    program: '',
    subscribe: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Add a new document with a generated ID
      await addDoc(collection(db, 'admissions'), formData);
      alert('Form submitted successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        program: '',
        subscribe: false
      });
    } catch (e) {
      alert('Error adding document: ' + e);
    }
  };

  return (
    <Card style={{ padding: "$6", maxWidth: "600px", margin: "auto" }}>
      <p className="text-2xl font-bold">Student Admission Form</p>
      <Spacer y={2} />

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              color="primary"
              size="lg"
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input
              color="primary"
              size="lg"
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              color="primary"
              size="lg"
              placeholder="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input
              color="primary"
              size="lg"
              placeholder="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Input
            color="primary"
            size="lg"
            placeholder="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <Input
            color="primary"
            size="lg"
            placeholder="Preferred Program"
            name="program"
            value={formData.program}
            onChange={handleChange}
          />
          <Checkbox
            name="subscribe"
            checked={formData.subscribe}
            onChange={handleChange}
          >
            <p>Subscribe to our newsletter</p>
          </Checkbox>
        </div>

        <Spacer y={2} />
        <Button size="lg" color="primary" type="submit">Submit</Button>
      </form>
    </Card>
  );
};

export default AdmissionForm;
