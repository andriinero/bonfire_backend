-- CreateTable
CREATE TABLE "friendRequests" (
    "id" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "senderId" TEXT,

    CONSTRAINT "friendRequests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "friendRequests" ADD CONSTRAINT "friendRequests_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendRequests" ADD CONSTRAINT "friendRequests_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
