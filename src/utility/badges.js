import sliver from '../@core/assets/images/badges/sliver.png';
import gold from '../@core/assets/images/badges/gold.png';
import platinum from '../@core/assets/images/badges/platinum.png';
import bronze from '../@core/assets/images/badges/bronze.png';

export const getBadgeImage = (badgeName) => {
  switch (badgeName) {
    case "Silver":
      return sliver;
    case "Gold":
      return gold;
    case "Platinum":
      return platinum;
    case "Bronze":
      return bronze;
    default:
      return null;
  }
};
