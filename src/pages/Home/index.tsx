import ReadViewer from '@/components/ReadViewer';
import { useModel } from '@umijs/max';
import React from 'react';

const HomePage: React.FC = () => {
  const { user } = useModel('user');

  return <ReadViewer userId={user.id}></ReadViewer>;
};

export default HomePage;
