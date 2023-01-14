// Importowanie niezbędnych modułów i komponentów z biblioteki Material UI
import { Box } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClearIcon from "@mui/icons-material/Clear"; // importowanie ikony usuwania
import "./Task.css"; // importowanie arkusza stylów
import { useState } from "react"; // importowanie hooka useState

// Tworzenie komponentu Task
const Task = ({ taskText, onComplete, onDelete, status }) => {
  const [isCompleted, setIsCompleted] = useState(false); // stan isCompleted jest ustawiony na false
  return (
    <Box className="todoList">
      <h4>{taskText} </h4>
      <Box>
        {isCompleted || status ? (
          // Jeśli zadanie jest wykonane lub status jest true, to wyświetl ikonę wykonanego zadania
          <CheckCircleIcon className="icon" fontSize="medium" color="a2ff69" />
        ) : (
          // W przeciwnym razie wyświetl ikonę nie wykonanego zadania
          <CheckCircleOutlineIcon
            className="icon"
            fontSize="medium"
            color="a2ff69"
            onClick={() => {
              onComplete();
              // Ustaw stan isCompleted na true
              setIsCompleted(true);
            }}
          />
        )}
        <ClearIcon
          className="icon"
          fontSize="medium"
          color="a2ff69"
          onClick={onDelete}
        />
      </Box>
    </Box>
  );
};
// eksportowanie komponentu
export default Task;
