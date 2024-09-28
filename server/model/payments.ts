import { RowDataPacket } from "mysql2";

export interface PaymentsType extends RowDataPacket {
  id: number;
  amount: number;
}
