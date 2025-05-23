"use client"

import type React from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { Layout, Tabs, Table, Button, Modal, Form, Input, Select, Upload } from "antd"

const { Content } = Layout
const { TabPane } = Tabs

const UserView: React.FC = () => {
  const supabase = useSupabaseClient()
  const router = useRouter()
  const { id } = router.query
  const [user, setUser] = useState<User | null>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [permissions, setPermissions] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    if (id) {
      fetchUser()
      fetchActivities()
      fetchPermissions()
      fetchTickets()
    }
  }, [id])

  const fetchUser = async () => {
    const { data } = await supabase.from("users").select("*").eq("id", id).single()
    setUser(data)
  }

  const fetchActivities = async () => {
    const { data } = await supabase.from("activities").select("*").eq("user_id", id)
    setActivities(data)
  }

  const fetchPermissions = async () => {
    const { data } = await supabase.from("permissions").select("*").eq("user_id", id)
    setPermissions(data)
  }

  const fetchTickets = async () => {
    const { data } = await supabase.from("tickets").select("*").eq("user_id", id)
    setTickets(data)
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const columns = [
    {
      title: "Activity",
      dataIndex: "activity",
      key: "activity",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ]

  const permissionColumns = [
    {
      title: "Tool",
      dataIndex: "tool",
      key: "tool",
    },
    {
      title: "Permissions",
      dataIndex: "permissions",
      key: "permissions",
    },
  ]

  const ticketColumns = [
    {
      title: "Ticket ID",
      dataIndex: "ticket_id",
      key: "ticket_id",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ]

  return (
    <Layout>
      <Content style={{ padding: "24px" }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="User Details" key="1">
            {user && (
              <div>
                <h1>{user.name}</h1>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
                <p>Bio: {user.bio}</p>
                <p>Status: {user.status}</p>
                <p>Role: {user.role}</p>
                <p>Verified: {user.verified ? "Yes" : "No"}</p>
              </div>
            )}
          </TabPane>
          <TabPane tab="Activities" key="2">
            <Table columns={columns} dataSource={activities} />
          </TabPane>
          <TabPane tab="Permissions" key="3">
            <Table columns={permissionColumns} dataSource={permissions} />
          </TabPane>
          <TabPane tab="Tickets" key="4">
            <Table columns={ticketColumns} dataSource={tickets} />
          </TabPane>
        </Tabs>
        <Button type="primary" onClick={showModal}>
          Edit User
        </Button>
        <Modal title="Edit User" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <Form>
            <Form.Item label="Name" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
              <Input />
            </Form.Item>
            <Form.Item label="Bio" name="bio">
              <Input.TextArea />
            </Form.Item>
            <Form.Item label="Status" name="status">
              <Select>
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Role" name="role">
              <Select>
                <Select.Option value="admin">Admin</Select.Option>
                <Select.Option value="user">User</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Verified" name="verified" valuePropName="checked">
              <Input type="checkbox" />
            </Form.Item>
            <Form.Item label="Profile Picture" name="profile_picture">
              <Upload />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  )
}

export default UserView
