/*
  Warnings:

  - A unique constraint covering the columns `[bookId]` on the table `borrows` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "borrows_book_id_unique" ON "borrows"("bookId");
