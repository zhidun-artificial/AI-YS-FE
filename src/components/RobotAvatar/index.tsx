import RobotIcon from '@/assets/images/robot.svg';

export default function RobotAvatar(props: { className?: string }) {
  return <img src={RobotIcon} className={props.className} alt="robot" />;
}
