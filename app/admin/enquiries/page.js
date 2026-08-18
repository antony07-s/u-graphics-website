import { connectDB } from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import EnquiriesTable from "@/components/admin/EnquiriesTable";

export const dynamic = "force-dynamic";

async function getEnquiries() {
  await connectDB();
  const enquiries = await Enquiry.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(enquiries));
}

export default async function AdminEnquiriesPage() {
  const enquiries = await getEnquiries();
  const newCount = enquiries.filter((e) => e.status === "new").length;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ink">Enquiries</h1>
      <p className="mt-1 text-sm text-ink/60">
        {enquiries.length} total{newCount > 0 && ` · ${newCount} new`}
      </p>

      <div className="mt-8">
        <EnquiriesTable enquiries={enquiries} />
      </div>
    </div>
  );
}