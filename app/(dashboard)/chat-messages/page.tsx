import ChatMessagesTable from "@/lib/components/tables/ChatMessagesTable";

export default function ChatMessagesPage() {
  return (
    <div className="space-y-6">
      <div className="pt-4">
        <h1 className="text-3xl font-bold text-gray-900">Chat Messages</h1>
        <p className="text-gray-600 mt-1">View and manage all chat messages</p>
      </div>
      <ChatMessagesTable />
    </div>
  );
}
