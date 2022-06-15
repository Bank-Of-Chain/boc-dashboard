import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';
import ChartCard from '@/components/ChartCard';

import { map } from 'lodash';

const topColResponsiveProps = {
  xs: 24,
  sm: 8,
  md: 8,
  lg: 8,
  xl: 8,
};


const IntroduceRow = ({ data = [] }) => {
  return (
    <Row gutter={[24, 24]}>
      {map(data, ({ title, tip, loading, content }) => (
        <Col key={title} {...topColResponsiveProps}>
          <ChartCard
            bordered={false}
            title={title}
            action={
              <Tooltip title={tip}>
                <InfoCircleOutlined style={{ fontSize: 22 }} />
              </Tooltip>
            }
            loading={loading}
            total={content}
          />
        </Col>
      ))}
    </Row>
  );
};

export default IntroduceRow;
