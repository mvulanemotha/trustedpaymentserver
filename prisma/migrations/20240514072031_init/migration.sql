-- CreateTable
CREATE TABLE "Vourchers" (
    "id" SERIAL NOT NULL,
    "vorcherNo" VARCHAR(20) NOT NULL,
    "pin" VARCHAR(20) NOT NULL,
    "transactionsId" INTEGER NOT NULL,

    CONSTRAINT "Vourchers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vourchers" ADD CONSTRAINT "Vourchers_transactionsId_fkey" FOREIGN KEY ("transactionsId") REFERENCES "Transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
