import { StreamChat } from "stream-chat";

const streamServerClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_KEY!, //value defined
  process.env.STREAM_SECRET,
);

export default streamServerClient;