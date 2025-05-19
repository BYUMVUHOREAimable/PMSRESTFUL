import { PaymentMethod, PaymentStatus } from "@prisma/client";

type SimplifiedPayment = {
  amount: number;
  method: PaymentMethod;
} | null;

type SessionWithSimplifiedPayment = {
  id: string;
  createdAt: Date;
  isExited: boolean;
  payment: SimplifiedPayment;
  paymentStatus: PaymentStatus;
  // Add other fields used in the function as needed
};

export function sortSessionsByPaymentAndExitStatus(
  sessions: SessionWithSimplifiedPayment[]
): SessionWithSimplifiedPayment[] {
  return sessions.sort((a, b) => {
    const getPriority = (session: SessionWithSimplifiedPayment) => {
      if (session.paymentStatus === "PENDING") return 1;
      if (session.paymentStatus === "PAID" && !session.isExited) return 2;
      if (session.paymentStatus === "PAID" && session.isExited) return 3;
      return 4;
    };

    const priorityA = getPriority(a);
    const priorityB = getPriority(b);

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
