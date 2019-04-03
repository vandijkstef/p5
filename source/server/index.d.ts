type Callback = (
	err: Error | false,
	data?: object,
) => void;

type ConnectionCallback = (
	err: import('mysql').MysqlError | false,
	connection?: import('mysql').Connection,
) => void;