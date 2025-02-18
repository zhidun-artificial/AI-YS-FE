import {
  AuthItem,
  getPermissions,
  RoleItem,
  setPermissions,
} from '@/services/user/role';
import { Button, Checkbox, CheckboxProps, Divider, message, Modal } from 'antd';
import { useEffect, useState } from 'react';

const CheckboxGroup = Checkbox.Group;

const AuthModal = (props: { record: RoleItem; key: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [menuOptions, setMenuOptions] = useState<any[]>([]);

  useEffect(() => {
    const getDefaultSelect = async () => {
      const res = await getPermissions(props.record.id);
      if (res instanceof Error) {
        return;
      }
      if (res.code === 0) {
        const checkedList = res.data.data
          .filter((item) => item.has)
          .map((item: any) => item.name);
        const options = res.data.data.map((item) => {
          return {
            ...item,
            key: item.id,
            value: item.name,
            label: item.title,
          };
        });
        setMenuOptions(options);
        setCheckedList(checkedList);
      }
    };
    if (isModalOpen) getDefaultSelect();
  }, [isModalOpen]);

  const checkAll = menuOptions.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < menuOptions.length;

  const onChange = (list: string[]) => {
    setCheckedList(list);
  };

  const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
    setCheckedList(
      e.target.checked ? menuOptions.map((item) => item.value) : [],
    );
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const authList: AuthItem[] = menuOptions.map((item) => {
      return {
        id: item.id,
        parentId: item.parentId,
        name: item.value,
        title: item.label,
        has: checkedList.includes(item.value),
      } as AuthItem;
    });

    const res = await setPermissions({ id: props.record.id, data: authList });
    if (res instanceof Error) {
      return;
    } else {
      if (res.code === 0) {
        message.success('授权成功');
        setIsModalOpen(false);
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="link" onClick={showModal}>
        授权
      </Button>
      <Modal
        title="角色权限配置"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Divider />
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
          style={{ marginBottom: 8 }}
        >
          全选
        </Checkbox>

        <CheckboxGroup
          className="flex flex-col gap-2"
          options={menuOptions}
          value={checkedList}
          onChange={onChange}
        />
      </Modal>
    </>
  );
};

export default AuthModal;
