import { LINE_SPACING, STAFF_TOP } from '#shared/constants';
import styles from '../Staff.module.css';

export const renderStaffLines = () => {
  return Array.from({ length: 5 }, (_, i) => (
    <div
      key={i}
      className={styles['staff-line']}
      style={{
        top: STAFF_TOP + i * LINE_SPACING,
      }}
    />
  ));
};
