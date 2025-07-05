/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import "./TodoList.css";
import { message } from "./Message";
import { List, Button, Input, Checkbox, Modal, Typography, Divider, Empty, Tooltip, Select, DatePicker, Tag, Row, Col, ColorPicker, Slider, Popover } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { HistoryOutlined, ClearOutlined, DeleteOutlined, CopyOutlined } from "@ant-design/icons";

// 历史记录项的类型接口 - 只记录每个Todo的最后一次操作
interface TodoHistory {
	todoId: number;
	todoText: string;
	lastAction: string;
	lastTimestamp: Date;
	project: string;
}

interface Todo {
	id: number;
	text: string;
	completed: boolean;
	project: string;
	priority: "高" | "中" | "低";
	dueDate: string | null;
}

const { Title, Text } = Typography;

const ThemeSwitcher: React.FC<{ onColorChange: (color: Color | string) => void; onZoomChange: (zoom: number) => void; }> = ({ onColorChange, onZoomChange }) => {
	const content = (
		<div style={{ width: 200 }}>
			<Typography.Text>背景颜色</Typography.Text>
			<ColorPicker onChangeComplete={(color) => onColorChange(color)} />
			<Typography.Text>页面缩放</Typography.Text>
			<Slider defaultValue={100} min={50} max={150} onChange={(value) => onZoomChange(value / 100)} />
		</div>
	);

	return (
		<Popover content={content} title="页面设置" trigger="click">
			<Button>页面设置</Button>
		</Popover>
	);
};

const TodoList: React.FC = () => {
	// 获取某个日期所属的周的开始日期（周一）
	const getWeekStart = (date: Date): Date => {
		const d = new Date(date);
		const day = d.getDay();
		const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 调整为周一开始
		d.setDate(diff);
		d.setHours(0, 0, 0, 0);
		return d;
	};

	// 格式化周标题
	const formatWeekTitle = (weekStart: Date): string => {
		const weekEnd = new Date(weekStart);
		weekEnd.setDate(weekStart.getDate() + 6);
		const now = new Date();
		const currentWeekStart = getWeekStart(now);

		if (weekStart.getTime() === currentWeekStart.getTime()) {
			return "本周";
		} else if (weekStart.getTime() === currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000) {
			return "上周";
		} else {
			return `${weekStart.getMonth() + 1}月${weekStart.getDate()}日 - ${weekEnd.getMonth() + 1}月${weekEnd.getDate()}日`;
		}
	};

	// 复制当前周历史记录到剪切板
	const copyWeekHistories = async (histories: TodoHistory[]) => {
		try {
			const formattedText = histories.map((history, index) => `${index + 1}.${history.todoText}`).join("\n");

			await navigator.clipboard.writeText(formattedText);
			message.success("历史记录已复制到剪切板！");
		} catch (err) {
			console.error("复制失败:", err);
			message.error("复制失败，请重试");
		}
	};

	// 按周分组历史记录
	const groupHistoriesByWeek = (histories: TodoHistory[]) => {
		const groups: { [key: string]: TodoHistory[] } = {};

		histories.forEach((history) => {
			const weekStart = getWeekStart(history.lastTimestamp);
			const weekKey = weekStart.getTime().toString();

			if (!groups[weekKey]) {
				groups[weekKey] = [];
			}
			groups[weekKey].push(history);
		});

		// 按周开始时间排序（最新的周在前）
		const sortedWeeks = Object.keys(groups).sort((a, b) => parseInt(b) - parseInt(a));

		return sortedWeeks.map((weekKey) => ({
			weekStart: new Date(parseInt(weekKey)),
			histories: groups[weekKey].sort((a, b) => b.lastTimestamp.getTime() - a.lastTimestamp.getTime()),
		}));
	};

	// 从localStorage读取初始数据
	const [todos, setTodos] = useState<Todo[]>(() => {
		const savedTodos = localStorage.getItem("todos");
		return savedTodos ? JSON.parse(savedTodos) : [];
	});

	const [todoHistories, setTodoHistories] = useState<TodoHistory[]>(() => {
		const savedHistories = localStorage.getItem("todoHistories");
		if (savedHistories) {
			const parsed = JSON.parse(savedHistories);
			// 将时间戳字符串转换回Date对象
			return parsed.map((item: any) => ({
				...item,
				lastTimestamp: new Date(item.lastTimestamp),
			}));
		}
		return [];
	});

	const [isHistoryModalVisible, setIsHistoryModalVisible] = useState<boolean>(false);

	// 保存todos到localStorage
	useEffect(() => {
		localStorage.setItem("todos", JSON.stringify(todos));
	}, [todos]);

	// 保存todoHistories到localStorage
	useEffect(() => {
		localStorage.setItem("todoHistories", JSON.stringify(todoHistories));
	}, [todoHistories]);

	// 更新Todo的历史记录 - 只保留最后一次操作
	const updateTodoHistory = (todoId: number, todoText: string, action: string, project: string) => {
		const newHistory: TodoHistory = {
			todoId,
			todoText,
			lastAction: action,
			lastTimestamp: new Date(),
			project,
		};

		setTodoHistories((prev) => {
			// 查找是否已存在该Todo的历史记录
			const existingIndex = prev.findIndex((h) => h.todoId === todoId);
			if (existingIndex >= 0) {
				// 更新现有记录
				const updated = [...prev];
				updated[existingIndex] = newHistory;
				return updated;
			} else {
				// 添加新记录
				return [...prev, newHistory];
			}
		});
	};
	const addTodo = (text: string, project: string, priority: "高" | "中" | "低", dueDate: string | null) => {
		const newTodo: Todo = {
			id: Date.now(),
			text: text,
			completed: false,
			project: project,
			priority: priority,
			dueDate: dueDate,
		};
		const newTodos = [...todos, newTodo];
		setTodos(newTodos);
		updateTodoHistory(newTodo.id, newTodo.text, "添加任务", newTodo.project);
	};
	const [inputValue, setInputValue] = useState<string>("");
	const [projectValue, setProjectValue] = useState<string>("默认项目");
	const [priorityValue, setPriorityValue] = useState<"高" | "中" | "低">("中");
	const [dueDateValue, setDueDateValue] = useState<string | null>(null);
	const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
	const [zoom, setZoom] = useState<number>(1);

	useEffect(() => {
		// Apply the background color to the body element
		document.body.style.backgroundColor = backgroundColor;

		// Cleanup function to reset the background color when the component unmounts
		return () => {
			document.body.style.backgroundColor = '';
		};
	}, [backgroundColor]);
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputValue.trim()) {
			addTodo(inputValue.trim(), projectValue, priorityValue, dueDateValue);
			setInputValue("");
			// Optionally reset other fields
			setProjectValue("默认项目");
			setPriorityValue("中");
			setDueDateValue(null);
		}
	};

	const toggleTodo = (id: Number) => {
		const newTodos = todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));
		const toggledTodo = newTodos.find((todo) => todo.id === id);
		if (toggledTodo) {
			const action = toggledTodo.completed ? "完成任务" : "取消完成";
			updateTodoHistory(Number(id), toggledTodo.text, action, toggledTodo.project);
		}
		setTodos(newTodos);
	};

	const deleteTodo = (id: Number) => {
		const todoToDelete = todos.find((todo) => todo.id === id);
		const newTodos = todos.filter((todo) => todo.id !== id);
		setTodos(newTodos);
		if (todoToDelete) {
			updateTodoHistory(Number(id), todoToDelete.text, "删除任务", todoToDelete.project);
		}
	};

	// 清空历史记录
	const clearHistory = () => {
		setTodoHistories([]);
	};

	// 删除特定Todo的历史记录
	const removeFromHistory = (todoId: number) => {
		setTodoHistories((prev) => prev.filter((h) => h.todoId !== todoId));
	};
	const handleColorChange = (color: Color | string) => {
		if (typeof color === 'object' && 'toHexString' in color) {
			setBackgroundColor(color.toHexString());
		} else {
			setBackgroundColor(color as string);
		}
	};

	const handleZoomChange = (value: number) => {
		setZoom(value);
	};

	return (
		<div className="todo-container" style={{ padding: "20px", maxWidth: "800px", margin: "auto", transform: `scale(${zoom})`, transition: 'all 0.3s', transformOrigin: 'top' }}>
			<div style={{ position: 'absolute', top: 20, right: 20, zIndex: 1 }}>
				<ThemeSwitcher onColorChange={handleColorChange} onZoomChange={handleZoomChange} />
			</div>
			<Title level={2} style={{ textAlign: "center" }}>
				周报小助手 TODO-List
			</Title>

			<div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
				<Button icon={<HistoryOutlined />} onClick={() => setIsHistoryModalVisible(true)}>
					查看历史 ({todoHistories.length})
				</Button>
			</div>

			<Modal
				title="操作历史"
				visible={isHistoryModalVisible}
				onCancel={() => setIsHistoryModalVisible(false)}
				footer={[
					<Button key="clear" type="primary" danger onClick={clearHistory} icon={<ClearOutlined />} disabled={todoHistories.length === 0}>
						清空历史
					</Button>,
					<Button key="close" onClick={() => setIsHistoryModalVisible(false)}>
						关闭
					</Button>,
				]}
				width={800}>
				{todoHistories.length > 0 ? (
					groupHistoriesByWeek(todoHistories).map(({ weekStart, histories }) => (
						<div key={weekStart.getTime()}>
							<Divider orientation="left">{formatWeekTitle(weekStart)}</Divider>
							<List
								size="small"
								header={
									<Button icon={<CopyOutlined />} size="small" onClick={() => copyWeekHistories(histories)}>
										复制本周
									</Button>
								}
								bordered
								dataSource={histories}
								renderItem={(item) => (
									<List.Item
										actions={[
											<Tooltip title="从历史中移除">
												<Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeFromHistory(item.todoId)} />
											</Tooltip>,
										]}>
										<Text>
											[{item.project}] {item.todoText}
										</Text>{" "}
										-{" "}
										<Text type="secondary">
											<small>
												{item.lastAction} at {item.lastTimestamp.toLocaleString()}
											</small>
										</Text>
									</List.Item>
								)}
							/>
						</div>
					))
				) : (
					<Empty description="暂无历史记录" />
				)}
			</Modal>

			<div style={{ marginBottom: "20px", padding: "20px", border: "1px solid #f0f0f0", borderRadius: "8px" }}>
				<Row gutter={16}>
					<Col span={24}>
						<Input size="large" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="输入任务内容" style={{ marginBottom: "10px" }} />
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={8}>
						<Input size="large" value={projectValue} onChange={(e) => setProjectValue(e.target.value)} placeholder="所属项目" />
					</Col>
					<Col span={6}>
						<Select size="large" value={priorityValue} onChange={setPriorityValue} style={{ width: "100%" }}>
							<Select.Option value="高">高</Select.Option>
							<Select.Option value="中">中</Select.Option>
							<Select.Option value="低">低</Select.Option>
						</Select>
					</Col>
					<Col span={6}>
						<DatePicker size="large" style={{ width: "100%" }} placeholder="截止日期" onChange={(date, dateString) => setDueDateValue(dateString as string | null)} />
					</Col>
					<Col span={4}>
						<Button type="primary" size="large" onClick={handleSubmit} style={{ width: "100%" }}>
							添加
						</Button>
					</Col>
				</Row>
			</div>

			<List
				bordered
				dataSource={todos}
				locale={{ emptyText: <Empty description="恭喜！所有任务都完成了！" /> }}
				renderItem={(todo) => (
					<List.Item
						className={todo.completed ? "completed-task" : ""}
						actions={[
							<Tooltip title="删除任务">
								<Button type="text" danger icon={<DeleteOutlined />} onClick={() => deleteTodo(todo.id as Number)} />
							</Tooltip>,
						]}>
						<Checkbox checked={todo.completed} onChange={() => toggleTodo(todo.id)} style={{ marginRight: "10px" }} />
						<div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
							<Text delete={todo.completed}>{todo.text}</Text>
							<div>
								<Tag color="blue">{todo.project}</Tag>
								<Tag color={todo.priority === "高" ? "red" : todo.priority === "中" ? "orange" : "green"}>{todo.priority}</Tag>
								{todo.dueDate && <Tag color="purple">{todo.dueDate}</Tag>}
							</div>
						</div>
					</List.Item>
				)}
			/>
		</div>
	);
};

export default TodoList;
