-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NULL,
    `phone` VARCHAR(191) NULL,
    `created` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `lastActive` DATETIME(3) NOT NULL,
    `userGroupId` INTEGER NOT NULL DEFAULT 1,
    `userPrefsId` INTEGER NULL,
    `wishlistId` INTEGER NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `discount` DECIMAL(8, 2) NULL,

    UNIQUE INDEX `UserGroup_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserPrefs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prefs` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cart` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `created` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NULL,
    `orderId` INTEGER NULL,

    UNIQUE INDEX `Cart_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CartDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `cartId` INTEGER NOT NULL,

    UNIQUE INDEX `CartDetails_cartId_key`(`cartId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wishlist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sku` VARCHAR(32) NOT NULL,
    `code` VARCHAR(32) NOT NULL,
    `barcode` VARCHAR(64) NULL,
    `caratage` VARCHAR(16) NULL,
    `weight` DECIMAL(6, 3) NULL,
    `price` DECIMAL(8, 2) NULL,
    `priceBefore` DECIMAL(8, 2) NULL,
    `cost` DECIMAL(8, 2) NULL,
    `discount` DECIMAL(8, 2) NULL,
    `margin` DECIMAL(8, 2) NULL,
    `created` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `title` VARCHAR(128) NULL,
    `description` VARCHAR(1024) NULL,
    `text` TEXT NULL,
    `seoH1` VARCHAR(128) NULL,
    `seoTitle` VARCHAR(255) NULL,
    `seoDescription` VARCHAR(1024) NULL,
    `brandId` INTEGER NOT NULL DEFAULT 1,
    `categoryId` INTEGER NOT NULL DEFAULT 1,
    `supplierId` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `Product_code_key`(`code`),
    UNIQUE INDEX `Product_barcode_key`(`barcode`),
    FULLTEXT INDEX `Product_sku_idx`(`sku`),
    FULLTEXT INDEX `Product_code_idx`(`code`),
    FULLTEXT INDEX `Product_title_idx`(`title`),
    FULLTEXT INDEX `Product_sku_code_title_idx`(`sku`, `code`, `title`),
    FULLTEXT INDEX `Product_description_idx`(`description`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NULL,
    `alt` VARCHAR(255) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `path` VARCHAR(512) NULL,
    `productId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `title` VARCHAR(128) NULL,
    `description` VARCHAR(1024) NULL,
    `text` TEXT NULL,
    `seoH1` VARCHAR(128) NULL,
    `seoTitle` VARCHAR(255) NULL,
    `seoDescription` VARCHAR(1024) NULL,
    `thumbnail` VARCHAR(191) NULL,
    `parentCategory` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `Category_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Brand` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `title` VARCHAR(128) NULL,
    `description` VARCHAR(1024) NULL,
    `text` TEXT NULL,
    `seoH1` VARCHAR(128) NULL,
    `seoTitle` VARCHAR(255) NULL,
    `seoDescription` VARCHAR(1024) NULL,
    `thumbnail` VARCHAR(191) NULL,
    `logo` VARCHAR(191) NULL,

    UNIQUE INDEX `Brand_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `title` VARCHAR(128) NULL,
    `description` VARCHAR(1024) NULL,
    `text` TEXT NULL,
    `thumbnail` VARCHAR(191) NULL,
    `logo` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NULL,
    `userId` INTEGER NOT NULL,
    `code` VARCHAR(32) NOT NULL,
    `weight` DECIMAL(8, 2) NOT NULL,
    `total` DECIMAL(8, 2) NOT NULL,
    `discount` DECIMAL(8, 2) NOT NULL,
    `deliveryPrice` DECIMAL(8, 2) NOT NULL,
    `statusId` INTEGER NOT NULL DEFAULT 1,
    `detailsId` INTEGER NOT NULL,

    UNIQUE INDEX `Order_code_key`(`code`),
    UNIQUE INDEX `Order_detailsId_key`(`detailsId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NULL,
    `clientComment` VARCHAR(1024) NULL,
    `managerComment` VARCHAR(1024) NULL,
    `city` VARCHAR(191) NULL,
    `adress` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `recipient` VARCHAR(191) NULL,
    `promocode` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderProducts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `productId` INTEGER NOT NULL,
    `orderId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(32) NOT NULL,
    `value` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Localisation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(64) NULL,
    `en` TEXT NULL,
    `he` TEXT NULL,
    `ru` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CartDetailsToProduct` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CartDetailsToProduct_AB_unique`(`A`, `B`),
    INDEX `_CartDetailsToProduct_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProductToWishlist` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ProductToWishlist_AB_unique`(`A`, `B`),
    INDEX `_ProductToWishlist_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_userPrefsId_fkey` FOREIGN KEY (`userPrefsId`) REFERENCES `UserPrefs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_wishlistId_fkey` FOREIGN KEY (`wishlistId`) REFERENCES `Wishlist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_userGroupId_fkey` FOREIGN KEY (`userGroupId`) REFERENCES `UserGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartDetails` ADD CONSTRAINT `CartDetails_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `Brand`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `OrderStatus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_detailsId_fkey` FOREIGN KEY (`detailsId`) REFERENCES `OrderDetails`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderProducts` ADD CONSTRAINT `OrderProducts_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderProducts` ADD CONSTRAINT `OrderProducts_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CartDetailsToProduct` ADD CONSTRAINT `_CartDetailsToProduct_A_fkey` FOREIGN KEY (`A`) REFERENCES `CartDetails`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CartDetailsToProduct` ADD CONSTRAINT `_CartDetailsToProduct_B_fkey` FOREIGN KEY (`B`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductToWishlist` ADD CONSTRAINT `_ProductToWishlist_A_fkey` FOREIGN KEY (`A`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductToWishlist` ADD CONSTRAINT `_ProductToWishlist_B_fkey` FOREIGN KEY (`B`) REFERENCES `Wishlist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
