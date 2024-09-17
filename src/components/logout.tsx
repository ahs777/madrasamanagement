import { FC } from 'react';
import { useAuth } from '@/context/AuthContext'; // Import the useAuth hook
import { Button } from '@nextui-org/button'; // Import the Button component from NextUI
import { useNavigate } from 'react-router-dom'; // Use react-router-dom's useNavigate for navigation
import { LogoutIcon } from '@/components/icons'; // Example import for a logout icon (adjust as needed)

const Logout: FC = () => {
  const { logout } = useAuth(); // Destructure logout from useAuth
  const navigate = useNavigate(); // Initialize react-router-dom's useNavigate

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function from your AuthContext
      navigate('/login'); // Redirect to login page or home page using react-router-dom
    } catch (error) {
      console.error("Failed to sign out:", error); // Handle error
    }
  };

  return (
    <Button
      color="danger" // Set button color to danger
      variant="bordered" // Use bordered variant
      startContent={<LogoutIcon />} // Set the icon for the button
      onClick={handleLogout} // Attach the click handler
    >
      Logout
    </Button>
  );
};

export default Logout;
