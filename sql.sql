CREATE DATABASE paypalbot;
USE paypalbot;
CREATE TABLE paypalbot(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    discordID varchar(255) DEFAULT 'None Set',
    discordTag varchar(255) DEFAULT 'None Set',
    descriptions varchar(255) DEFAULT 'None Set',
    amount varchar(255) DEFAULT 'None Set',
    productid varchar(255) DEFAULT 'None Set',
    dateofthepayment varchar(255) DEFAULT 'None Set',
    payer_id varchar(255) DEFAULT 'None Set',
    email varchar(255) DEFAULT 'None Set',
    orderstatus varchar(255) DEFAULT 'None Set',
    channel varchar(255) DEFAULT 'None Set',
    hasitbeensent varchar(255) DEFAULT '0'
);

CREATE TABLE products(
      id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
      product varchar(255) DEFAULT 'None Set',
      price varchar(255) DEFAULT 'None Set',
      download_link varchar(255) DEFAULT 'None Set'
);

