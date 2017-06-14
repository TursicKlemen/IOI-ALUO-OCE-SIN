SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `konfig` (
  `kljuc` varchar(20) COLLATE utf8_slovenian_ci NOT NULL,
  `value` text COLLATE utf8_slovenian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_slovenian_ci;

INSERT INTO `konfig` (`kljuc`, `value`) VALUES
('barvnaShema', 'info'),
('days', '36'),
('drawingColor', '#000000'),
('drawingWidth', '2'),
('engl', 'Draw 1 line as you obey your imagination and write your father\'s and son\'s name.'),
('lineColor', '#000000'),
('lineWidth', '1'),
('namesANG', 'Saved names - Showing records within {d} days'),
('namesSLO', 'Shranjena imena - Prikaz zgodovine za {d} dni'),
('slov', 'Nariši 1 linijo kot ti veleva tvoja imaginacija in napiši ime tvojega očeta in sina.');

CREATE TABLE `records` (
  `id` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip` text COLLATE utf8_slovenian_ci NOT NULL,
  `nameFather` text COLLATE utf8_slovenian_ci NOT NULL,
  `nameSon` text COLLATE utf8_slovenian_ci NOT NULL,
  `coords` text COLLATE utf8_slovenian_ci NOT NULL,
  `coordsInv` text COLLATE utf8_slovenian_ci NOT NULL,
  `offCenter` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_slovenian_ci;


ALTER TABLE `konfig`
  ADD PRIMARY KEY (`kljuc`);

ALTER TABLE `records`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
