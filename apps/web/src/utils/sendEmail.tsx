import { authAxios } from "../components/utils/axiosKits";

const sendEmail = async (emailType: string) => {
  try {
    const { data } = await authAxios({
      method: "POST",
      url: `/email/send`,
      data: {
        emailType,
      },
    });
    // Optionally, you can handle the response here if needed.
  } catch (error) {
    // Handle errors, e.g., display an error message or log the error.
    console.error("Error sending email:", error);
  }
};

export default sendEmail;
