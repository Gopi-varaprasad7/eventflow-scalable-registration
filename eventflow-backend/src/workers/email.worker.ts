import { emailQueue } from "../queues/email.queue";
import { sendConfirmationEmail } from "../services/email.service";

emailQueue.process("send-confirmation", async (job) => {

  const { email, eventTitle } = job.data;

  console.log("Processing job:", job.name);

  await sendConfirmationEmail(email, eventTitle);

  console.log(`Email sent to ${email}`);
});