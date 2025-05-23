import type React from "react"
import { Form, Input, Button } from "antd"
import type { User } from "../../types/user"

interface UserFormPageProps {
  user: User
  onSave: (updatedUser: User) => void
}

const UserFormPage: React.FC<UserFormPageProps> = ({ user, onSave }) => {
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    const updatedUser: User = {
      ...user,
      ...values,
    }
    onSave(updatedUser)
  }

  return (
    <div>
      <h1>Formulário de Usuário</h1>
      <Form form={form} initialValues={user} onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Nome"
          rules={[{ required: true, message: "Por favor, insira o nome do usuário!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Por favor, insira o email do usuário!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Salvar
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default UserFormPage
