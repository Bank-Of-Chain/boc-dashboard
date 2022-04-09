import numeral from 'numeral';
import ChartCard from './ChartCard';
import Field from './Field';

const yuan = (val) => `¥ ${numeral(val).format('0,0')}`;

const dollar = (val) => `$ ${numeral(val).format('0,0')}`;

const Charts = {
  dollar,
  yuan,
  ChartCard,
  Field,
};
export { Charts as default, yuan, ChartCard, Field, dollar };
