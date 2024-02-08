import { Form } from "@remix-run/react";
import { FormEvent, useEffect, useState } from "react";
import SquareIconButton from "~/components/Buttons/SquareIconButton";

type Props = {
  submitValue: string;
  taskName: string;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  taskRunning?: string;
};

const TaskListTask = ({
  submitValue,
  taskName,
  taskRunning,
  handleSubmit,
}: Props) => {
  const [running, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    if (taskRunning === taskName) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  }, [taskRunning, taskName]);

  return (
    <Form
      method="POST"
      onSubmit={handleSubmit}
      className="relative flex items-center gap-3"
    >
      {!running ? (
        <SquareIconButton
          iconName="IoPlay"
          size="xsmall"
          type="submit"
          name="_action"
          value={submitValue}
          color="primary"
        />
      ) : (
        <SquareIconButton
          iconName="IoPlayForwardSharp"
          size="xsmall"
          type="button"
          color="error"
          extendStyle="!select-none"
        />
      )}
      <input hidden readOnly name="taskName" value={taskName} />
      <div className="text-sm">{taskName}</div>
    </Form>
  );
};

export default TaskListTask;
