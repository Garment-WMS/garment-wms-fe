import {
  Circle,
  Droplet,
  Hexagon,
  Info,
  Layers,
  Palette,
  Scale,
  Thermometer,
  FlaskRoundIcon as Flask,
  Flame,
  Waves,
  Sun,
  Package,
  Shirt,
  Grid,
  Minimize,
  Scissors,
  Globe
} from 'lucide-react';

const iconClassName = 'h-5 w-5';
export const getIconAttributes = (name: string) => {
  switch (name.toLowerCase()) {
    case 'diameter':
      return <Circle className={iconClassName} />;
    case 'shape':
      return <Hexagon className={iconClassName} />;
    case 'material':
      return <Layers className={iconClassName} />;
    case 'gloss level':
      return <Droplet className={iconClassName} />;
    case 'temperature resistance':
      return <Thermometer className={iconClassName} />;
    case 'storage temperature':
      return <Thermometer className={iconClassName} />;
    case 'viscosity':
      return <Droplet className={iconClassName} />;
    case 'density':
      return <Scale className={iconClassName} />;
    case 'ph level':
      return <Flask className={iconClassName} />;
    case 'boiling point':
      return <Flame className={iconClassName} />;
    case 'solubility':
      return <Waves className={iconClassName} />;
    case 'lightfastness':
      return <Sun className={iconClassName} />;
    case 'packaging type':
      return <Package className={iconClassName} />;
    case 'application':
      return <Shirt className={iconClassName} />;
    case 'color':
      return <Palette className="h-5 w-5" />;
    case 'material composition':
      return <Shirt className="h-5 w-5" />;
    case 'pattern':
      return <Grid className="h-5 w-5" />;
    case 'shrinkage':
      return <Minimize className="h-5 w-5" />;
    case 'weave type':
      return <Waves className="h-5 w-5" />;
    case 'dye type':
      return <Droplet className="h-5 w-5" />;
    case 'care instructions':
      return <Scissors className="h-5 w-5" />;
    case 'origin':
      return <Globe className="h-5 w-5" />;
    default:
      return <Info className={iconClassName} />;
  }
};
