-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 05 jan. 2026 à 21:25
-- Version du serveur : 8.2.0
-- Version de PHP : 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `sushi_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `aliments`
--

DROP TABLE IF EXISTS `aliments`;
CREATE TABLE IF NOT EXISTS `aliments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `aliments`
--

INSERT INTO `aliments` (`id`, `name`, `description`) VALUES
(1, 'California Saumon Avocat', 'California roll avec saumon et avocat frais'),
(2, 'Sushi Saumon', 'Sushi traditionnel au saumon'),
(3, 'Spring Avocat Cheese', 'Printemps croustillant avec avocat et fromage'),
(4, 'California pacific', 'California roll saveur pacifique'),
(5, 'Edamame/Salade de chou', 'Haricots edamame ou salade de chou fraîche'),
(6, 'Maki Salmon Roll', 'Maki au saumon roulé'),
(7, 'Spring Saumon Avocat', 'Printemps avec saumon et avocat'),
(8, 'Maki Cheese Avocat', 'Maki avec fromage et avocat'),
(9, 'Sushi Thon', 'Sushi au thon frais'),
(10, 'California Thon Avocat', 'California roll avec thon et avocat'),
(11, 'California Crevette', 'California roll à la crevette'),
(12, 'California Thon Cuit Avocat', 'California roll au thon cuit'),
(13, 'California Chicken Katsu', 'California roll au poulet croustillant'),
(14, 'Spring tataki Saumon', 'Printemps avec saumon tataki'),
(15, 'Signature Dragon Roll', 'Dragon roll signature maison'),
(16, 'California French Touch', 'California roll à la française'),
(17, 'California French salmon', 'California roll saumon à la française'),
(18, 'California Yellowtail Ponzu', 'California roll à la sériole avec sauce ponzu'),
(19, 'Signature Rock\'n Roll', 'Rock\'n Roll signature maison'),
(20, 'Maki Salmon', 'Maki simple au saumon'),
(21, 'Sushi Saumon Tsukudani', 'Sushi saumon préparation tsukudani'),
(22, 'Sando Chicken Katsu', 'Sandwich poulet croustillant'),
(23, 'Sando Salmon Aburi', 'Sandwich saumon légèrement torréfié');

-- --------------------------------------------------------

--
-- Structure de la table `boxes`
--

DROP TABLE IF EXISTS `boxes`;
CREATE TABLE IF NOT EXISTS `boxes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `pieces` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `boxes`
--

INSERT INTO `boxes` (`id`, `name`, `pieces`, `price`, `image`) VALUES
(1, 'Tasty Blend', 12, 12.50, '../images/amateur-mix.jpg'),
(2, 'Amateur Mix', 18, 15.90, '../images/amateur-mix.jpg'),
(3, 'Saumon Original', 11, 12.50, '../images/amateur-mix.jpg'),
(4, 'Salmon Lovers', 18, 15.90, '../images/amateur-mix.jpg'),
(5, 'Salmon Classic', 10, 15.90, '../images/amateur-mix.jpg'),
(6, 'Master Mix', 12, 15.90, '../images/amateur-mix.jpg'),
(7, 'Sunrise', 18, 15.90, '../images/amateur-mix.jpg'),
(8, 'Sando Box Chicken Katsu', 13, 15.90, '../images/amateur-mix.jpg'),
(9, 'Sando Box Salmon Aburi', 13, 15.90, '../images/amateur-mix.jpg'),
(10, 'Super Salmon', 24, 19.90, '../images/amateur-mix.jpg'),
(11, 'California Dream', 24, 19.90, '../images/amateur-mix.jpg'),
(12, 'Gourmet Mix', 22, 24.50, '../images/amateur-mix.jpg'),
(13, 'Fresh Mix', 22, 24.50, '../images/amateur-mix.jpg');

-- --------------------------------------------------------

--
-- Structure de la table `box_aliments`
--

DROP TABLE IF EXISTS `box_aliments`;
CREATE TABLE IF NOT EXISTS `box_aliments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `box_id` int NOT NULL,
  `aliment_id` int NOT NULL,
  `quantite` int DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `box_aliment` (`box_id`,`aliment_id`),
  KEY `aliment_id` (`aliment_id`)
) ENGINE=MyISAM AUTO_INCREMENT=159 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `box_aliments`
--

INSERT INTO `box_aliments` (`id`, `box_id`, `aliment_id`, `quantite`) VALUES
(100, 1, 1, 3),
(101, 1, 2, 3),
(102, 1, 3, 3),
(103, 1, 4, 3),
(104, 1, 5, 1),
(105, 2, 6, 3),
(106, 2, 7, 3),
(107, 2, 8, 6),
(108, 2, 1, 3),
(109, 2, 5, 1),
(110, 3, 1, 6),
(111, 3, 2, 5),
(112, 3, 5, 1),
(113, 4, 1, 6),
(114, 4, 7, 6),
(115, 4, 2, 6),
(116, 4, 5, 1),
(117, 5, 2, 10),
(118, 5, 5, 1),
(119, 6, 2, 4),
(120, 6, 9, 2),
(121, 6, 10, 3),
(122, 6, 1, 3),
(123, 6, 5, 1),
(124, 7, 6, 6),
(125, 7, 1, 6),
(126, 7, 12, 6),
(127, 7, 5, 1),
(128, 8, 22, 1),
(129, 8, 6, 6),
(130, 8, 1, 6),
(131, 8, 12, 6),
(132, 8, 5, 1),
(133, 9, 23, 1),
(134, 9, 1, 6),
(135, 9, 12, 6),
(136, 9, 5, 1),
(137, 10, 1, 6),
(138, 10, 6, 6),
(139, 10, 20, 6),
(140, 10, 7, 6),
(141, 10, 5, 1),
(142, 11, 1, 6),
(143, 11, 11, 6),
(144, 11, 12, 6),
(145, 11, 13, 6),
(146, 11, 5, 1),
(147, 12, 14, 6),
(148, 12, 15, 4),
(149, 12, 16, 3),
(150, 12, 17, 6),
(151, 12, 18, 3),
(152, 12, 5, 1),
(153, 13, 19, 4),
(154, 13, 6, 6),
(155, 13, 4, 6),
(156, 13, 2, 4),
(157, 13, 21, 2),
(158, 13, 5, 1);

-- --------------------------------------------------------

--
-- Structure de la table `box_saveurs`
--

DROP TABLE IF EXISTS `box_saveurs`;
CREATE TABLE IF NOT EXISTS `box_saveurs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `box_id` int NOT NULL,
  `saveur_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `box_saveur` (`box_id`,`saveur_id`),
  KEY `saveur_id` (`saveur_id`)
) ENGINE=MyISAM AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `box_saveurs`
--

INSERT INTO `box_saveurs` (`id`, `box_id`, `saveur_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 2, 4),
(5, 2, 1),
(6, 2, 2),
(7, 2, 3),
(8, 3, 1),
(9, 3, 2),
(10, 4, 4),
(11, 4, 1),
(12, 4, 2),
(13, 5, 1),
(14, 6, 1),
(15, 6, 5),
(16, 6, 2),
(17, 7, 1),
(18, 7, 5),
(19, 7, 2),
(20, 7, 3),
(21, 8, 1),
(22, 8, 8),
(23, 8, 2),
(24, 8, 3),
(25, 9, 1),
(26, 9, 5),
(27, 9, 2),
(28, 10, 4),
(29, 10, 1),
(30, 10, 2),
(31, 10, 3),
(32, 11, 6),
(33, 11, 1),
(34, 11, 5),
(35, 11, 7),
(36, 11, 8),
(37, 11, 2),
(38, 12, 4),
(39, 12, 6),
(40, 12, 1),
(41, 12, 8),
(42, 12, 2),
(43, 12, 9),
(44, 13, 6),
(45, 13, 1),
(46, 13, 5),
(47, 13, 2),
(48, 13, 3);

-- --------------------------------------------------------

--
-- Structure de la table `commandes`
--

DROP TABLE IF EXISTS `commandes`;
CREATE TABLE IF NOT EXISTS `commandes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `prix_total` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `commandes`
--

INSERT INTO `commandes` (`id`, `user_id`, `prix_total`, `created_at`) VALUES
(7, 2, 48.30, '2026-01-04 03:12:28'),
(8, 2, 24.50, '2026-01-04 03:12:35'),
(9, 2, 12.50, '2026-01-04 03:13:09'),
(10, 2, 12.50, '2026-01-04 03:13:43'),
(11, 2, 12.50, '2026-01-04 03:14:10'),
(12, 2, 12.50, '2026-01-04 03:16:43'),
(13, 2, 12.50, '2026-01-04 03:17:35'),
(14, 2, 159.00, '2026-01-04 03:19:55'),
(15, 2, 24.50, '2026-01-04 03:27:54'),
(16, 2, 15.90, '2026-01-04 03:28:44'),
(17, 2, 19.90, '2026-01-04 03:30:34'),
(18, 2, 12.50, '2026-01-04 03:32:00'),
(19, 2, 24.50, '2026-01-04 03:32:56'),
(20, 2, 24.50, '2026-01-04 03:35:03'),
(21, 2, 24.50, '2026-01-04 03:37:03'),
(22, 2, 31.80, '2026-01-04 03:37:34'),
(23, 2, 19.90, '2026-01-04 03:40:35'),
(24, 2, 15.63, '2026-01-04 03:41:18'),
(25, 2, 96.32, '2026-01-04 03:43:03'),
(26, 2, 24.08, '2026-01-04 04:01:55'),
(27, 2, 35.19, '2026-01-05 04:47:51'),
(28, 2, 171.92, '2026-01-05 20:13:12'),
(29, 2, 19.56, '2026-01-05 20:22:10'),
(30, 3, 19.90, '2026-01-05 20:37:07'),
(31, 1, 19.90, '2026-01-05 21:25:36'),
(32, 4, 98.01, '2026-01-05 21:31:54'),
(33, 4, 15.90, '2026-01-05 21:32:14'),
(34, 5, 59.70, '2026-01-05 21:34:37'),
(35, 5, 12.50, '2026-01-05 21:36:22'),
(36, 5, 15.90, '2026-01-05 21:36:53'),
(37, 5, 109.63, '2026-01-05 21:38:04'),
(38, 5, 156.81, '2026-01-05 21:39:57'),
(39, 5, 137.21, '2026-01-05 21:41:22'),
(40, 2, 12.50, '2026-01-05 21:42:01'),
(41, 5, 19.90, '2026-01-05 21:48:03'),
(42, 4, 73.88, '2026-01-05 22:01:49');

-- --------------------------------------------------------

--
-- Structure de la table `commande_items`
--

DROP TABLE IF EXISTS `commande_items`;
CREATE TABLE IF NOT EXISTS `commande_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `commande_id` int DEFAULT NULL,
  `box_id` int DEFAULT NULL,
  `quantite` int DEFAULT NULL,
  `price_at_time` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `commande_id` (`commande_id`),
  KEY `box_id` (`box_id`)
) ENGINE=MyISAM AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `commande_items`
--

INSERT INTO `commande_items` (`id`, `commande_id`, `box_id`, `quantite`, `price_at_time`) VALUES
(8, 13, 3, 1, 12.50),
(9, 14, 6, 10, 15.90),
(10, 15, 13, 1, 24.50),
(11, 16, 5, 1, 15.90),
(12, 17, 11, 1, 19.90),
(13, 18, 3, 1, 12.50),
(14, 19, 13, 1, 24.50),
(15, 20, 13, 1, 24.50),
(16, 21, 13, 1, 24.50),
(17, 22, 6, 2, 15.90),
(18, 23, 11, 1, 19.90),
(19, 24, 2, 1, 15.90),
(20, 25, 11, 5, 19.90),
(21, 26, 13, 1, 24.50),
(22, 27, 11, 1, 19.90),
(23, 27, 2, 1, 15.90),
(24, 28, 11, 4, 19.90),
(25, 28, 13, 4, 24.50),
(26, 29, 11, 1, 19.90),
(27, 30, 11, 1, 19.90),
(28, 31, 11, 1, 19.90),
(29, 32, 11, 5, 19.90),
(30, 33, 5, 1, 15.90),
(31, 34, 10, 3, 19.90),
(32, 35, 1, 1, 12.50),
(33, 36, 4, 1, 15.90),
(34, 37, 4, 7, 15.90),
(35, 38, 11, 8, 19.90),
(36, 39, 11, 7, 19.90),
(37, 40, 1, 1, 12.50),
(38, 41, 11, 1, 19.90),
(39, 42, 1, 6, 12.50);

-- --------------------------------------------------------

--
-- Structure de la table `saveurs`
--

DROP TABLE IF EXISTS `saveurs`;
CREATE TABLE IF NOT EXISTS `saveurs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `saveurs`
--

INSERT INTO `saveurs` (`id`, `name`) VALUES
(1, 'saumon'),
(2, 'avocat'),
(3, 'cheese'),
(4, 'coriandre'),
(5, 'thon'),
(6, 'spicy'),
(7, 'crevette'),
(8, 'viande'),
(9, 'seriole lalandi');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `telephone` int NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `statut` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `telephone`, `adresse`, `statut`) VALUES
(1, 'test', 'test@', 'test', 0, '', ''),
(2, 'test2', 'test2@', '123456', 2541, '13rue', 'etudiant'),
(3, 'admin', 'admin@', 'admin', 610400456, 'rue', 'admin'),
(4, 'test3', 'test3@', '$2y$10$1k2SW8tccuakmdkto8ylBOBICHe./mSmMflhj.rQvcm7UifJ710SO', 123456789, 'rue', ''),
(5, 'admin1', 'admin1@', '$2y$10$9j.EwMC1qbWoPnIhyXkogOQZQV7DzpgNgJ5iY49WCpVWnSds8lpBG', 123456789, 'adresse', 'admin');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
