// app/(admin)/denemeler/page.tsx

"use client";

import { tytGenelList } from "@/types";
import DataTable from "./data-table";


// Örnek veri kümesi
const data: tytGenelList[] = [
  { id: "1", turkceNet: 35, matematikNet: 28, sosyalNet: 27, fenNet: 30, toplamNet: 120 },
  { id: "2", turkceNet: 22, matematikNet: 18, sosyalNet: 20, fenNet: 19, toplamNet: 79 },
  { id: "3", turkceNet: 40, matematikNet: 38, sosyalNet: 29, fenNet: 32, toplamNet: 139 },
];

// export default function DenemelerPage() {
//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-4">Dersler Yönetimi</h1>
//       <DataTable data={data} />
//     </div>
//   );
// }
