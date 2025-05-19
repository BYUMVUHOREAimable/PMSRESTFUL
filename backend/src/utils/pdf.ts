import { ParkingSession, User } from "@prisma/client";
import PDFDocument from "pdfkit";
import { ExitTicketPayload } from "../types";

export const generatePDFBuffer = (payload: ExitTicketPayload, user: User) => {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers: Uint8Array[] = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    // Document Content
    doc.fontSize(20).text("Parking Exit Ticket", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Name: ${user.firstName} ${user.lastName}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Slot: ${payload.slotNumber}`);
    doc.text(`Entry Time: ${payload.entryTime}`);
    doc.text(`Exit Time: ${payload.exitTime}`);
    doc.text(`Payment Status: ${payload.status}`);
    doc.text(`Fee: ${payload.fee || "N/A"}`);
    doc.text(`Vehicle: ${payload.vehiclePlateNumber || "N/A"}`);

    doc.end();
  });
};
export const formatToReadableDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toDateString() + " " + date.toLocaleTimeString();
};
