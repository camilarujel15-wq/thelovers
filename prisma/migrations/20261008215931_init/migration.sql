-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('RECIBIDO', 'DISENO_PROCESO', 'DISENO_APROBADO', 'PRODUCCION', 'EMPAQUETADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDIENTE', 'PAGADO');

-- CreateEnum
CREATE TYPE "FileKind" AS ENUM ('FOTO', 'VIDEO', 'AUDIO');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'RECIBIDO',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDIENTE',
    "paymentMethod" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3),
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "productSlug" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "size" TEXT,
    "presentation" TEXT,
    "extras" TEXT[],
    "braceletInitials" TEXT[],
    "designFields" JSONB NOT NULL,
    "comments" TEXT,
    "photosLater" BOOLEAN NOT NULL DEFAULT false,
    "mediaLater" BOOLEAN NOT NULL DEFAULT false,
    "deliveryMethod" TEXT NOT NULL,
    "region" TEXT,
    "province" TEXT,
    "city" TEXT,
    "address" TEXT,
    "reference" TEXT,
    "shalomAgency" TEXT,
    "deliveryNotes" TEXT,
    "basePrice" INTEGER NOT NULL,
    "extrasPrice" INTEGER NOT NULL,
    "shippingPrice" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "estimatedFrom" TIMESTAMP(3) NOT NULL,
    "estimatedTo" TIMESTAMP(3) NOT NULL,
    "internalNote" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderFile" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "kind" "FileKind" NOT NULL,
    "groupId" TEXT,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "fileName" TEXT NOT NULL,
    "bytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderEvent" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_code_key" ON "Order"("code");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_paymentStatus_idx" ON "Order"("paymentStatus");

-- CreateIndex
CREATE INDEX "Order_customerEmail_idx" ON "Order"("customerEmail");

-- CreateIndex
CREATE INDEX "Order_customerPhone_idx" ON "Order"("customerPhone");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "OrderFile_orderId_idx" ON "OrderFile"("orderId");

-- CreateIndex
CREATE INDEX "OrderEvent_orderId_idx" ON "OrderEvent"("orderId");

-- AddForeignKey
ALTER TABLE "OrderFile" ADD CONSTRAINT "OrderFile_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderEvent" ADD CONSTRAINT "OrderEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
