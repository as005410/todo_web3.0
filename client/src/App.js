import { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Task from "./Task/Task";
import "./App.css";

import { TaskContractAddress } from "./config";
import { ethers } from "ethers";
import TaskAbi from "./utils/TaskContract.json";

//Komponent funkcyjny App który korzysta z hooków useEffect i useState
function App() {
  // Zmienne stanu dla zadań, tekstu wejściowego, liczników, bieżącego konta i stanu poprawnej sieci
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [counter, setCounter] = useState(0);
  const [completedCounter, setCompletedCounter] = useState(0);
  const [currentAccount, setCurrentAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //Funkcja, która próbuje połączyć się z portfelem Metamask
  const connectWallet = async () => {
    setIsLoading(true); // ustawienie stanu isLoading na true (w trakcie łączenia się z portfelem)
    try {
      const { ethereum } = window;
      if (!ethereum) {
        // Sprawdzanie czy Metamask jest zainstalowany
        console.log("Metamask not detected");
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" }); // Pobieranie id łańcucha
      console.log("Connected to chain:" + chainId);

      const GoerliChainId = "0x5";

      if (chainId !== GoerliChainId) {
        alert("You are not connected to the Goerli Testnet!");
        return;
      } else {
        setCorrectNetwork(true);
      }
      //pobranie konta
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Found account", accounts[0]);
      setCurrentAccount(accounts[0]); // ustawienie aktualnego konta
      setIsLoading(false); // ustawienie stanu isLoading na false (po zakończeniu łączenia się z portfelem)
    } catch (error) {
      console.log("Error connecting to metamask", error);
      setIsLoading(false); // ustawienie stanu isLoading na false (w przypadku błędu)
    }
  };

  useEffect(() => {
    getAllTasks();
    getCounter();
    getCompletedCounter();
  }, []);

  //Funkcja używana do dodawania zadania
  const addTask = async (e) => {
    e.preventDefault();
    //tworzenie objektu
    let task = {
      taskText: input,
      isDeleted: false,
      isCompleted: false,
    };
    // ustawienie stanu isLoading na true (w trakcie dodawania zadania)
    setIsLoading(true);
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Tworzenie providera i signera
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        // Tworzenie instancji kontraktu
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );
        console.log(TaskContract);

        // Wywołanie metody addTask na kontrakcie
        let addTaskTx = await TaskContract.addTask(
          task.taskText,
          task.isDeleted,
          task.isCompleted
        );
        // Pobieranie potwierdzenia transakcji
        let receipt = await provider.getTransactionReceipt(addTaskTx.hash);
        while (!receipt) {
          setIsLoading(true);
          receipt = await provider.getTransactionReceipt(addTaskTx.hash);
        }
        console.log(receipt);
        // Pobieranie wszystkich zadań z kontraktu
        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks); // ustawienie stanu tasks na pobrane zadania
        console.log("Completed Task");
        getCounter(); // wywołanie funkcji pobierającej liczbę zadań
        getCompletedCounter(); // wywołanie funkcji pobierającej liczbę wykonanych zadań
        setIsLoading(false); // ustawienie stanu isLoading na false (po zakończeniu dodawania zadania)
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error submitting new Tweet", error);
      setIsLoading(false);
    }
    // czyszczenie inputu
    setInput("");
  };
  // Funkcja używana do usuwania zadania
  const deleteTask = (key) => async () => {
    setIsLoading(true);
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Tworzenie providera i signera
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        // Tworzenie instancji kontraktu
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );
        // wywołanie metody deleteTask na kontrakcie
        let deleteTaskTx = await TaskContract.deleteTask(key, true);
        // pobieranie potwierdzenia transakcji
        let receipt = await provider.getTransactionReceipt(deleteTaskTx.hash);
        while (!receipt) {
          receipt = await provider.getTransactionReceipt(deleteTaskTx.hash);
        }
        // console.log(receipt);
        // Pobieranie wszystkich zadań z kontraktu
        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks); // ustawienie stanu tasks na pobrane zadania
        getCounter(); // wywołanie funkcji pobierającej liczbę zadań
        getCompletedCounter(); // wywołanie funkcji pobierającej liczbę wykonanych zadań
        setIsLoading(false); // ustawienie stanu isLoading na false (po zakończeniu usuwania zadania)
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  // Funkcja używana dla zmiany statusu zadania
  const completeTask = (key) => async () => {
    setIsLoading(true);
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );
        // wywołanie metody completeTask na kontrakcie
        let completeTaskTx = await TaskContract.completeTask(key, true);
        // pobieranie potwierdzenia transakcji
        let receipt = await provider.getTransactionReceipt(completeTaskTx.hash);
        while (!receipt) {
          receipt = await provider.getTransactionReceipt(completeTaskTx.hash);
        }
        console.log(receipt);
        // Pobieranie wszystkich zadań z kontraktu
        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks);
        console.log(allTasks);
        getCounter(); // wywołanie funkcji pobierającej liczbę zadań
        getCompletedCounter(); // wywołanie funkcji pobierającej liczbę wykonanych zadań
        setIsLoading(false);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  // Pobieranie wszystkich zadań z kontraktu
  const getAllTasks = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );
        // wywołanie metody deleteTask na kontrakcie
        let allTasks = await TaskContract.getMyTasks();
        // ustawienie stanu tasks na pobrane zadania
        setTasks(allTasks);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Pobieranie liczby zadań z kontraktu
  const getCounter = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );
        // wywołanie metody getTaskCount na kontrakcie
        let countAllTasks = await TaskContract.getTaskCount();
        //zmiana typu otrzymanych danych
        let taskCounter = countAllTasks.toString();
        // ustawienie stanu licznika
        setCounter(taskCounter);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Pobieranie liczby skończonych zadań z kontraktu
  const getCompletedCounter = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );
        // wywołanie metody getCompletedTaskCount na kontrakcie
        let countCompletedTasks = await TaskContract.getCompletedTaskCount();
        //zmiana typu otrzymanych danych
        let completedCounter = countCompletedTasks.toString();
        // ustawienie stanu licznika
        setCompletedCounter(completedCounter);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {currentAccount === "" ? (
        <div className="start">
          <h1>
            Get organized and knock out your to-dos with our super simple and
            user-friendly to-do app. We've stripped away all the fancy bells and
            whistles, so you can focus on what really matters: getting things
            done!
          </h1>
          <h2>
            Connect your metamask wallet now and make getting things done a
            breeze!
          </h2>
          <Button
            style={{
              borderRadius: 35,
              backgroundColor: "#a2ff69",
              color: "black",
              padding: "14px 18px",
              margin: "40px",
              fontSize: "15px",
              fontWeight: "bold",
            }}
            variant="contained"
            onClick={connectWallet}
          >
            Connect Wallet
          </Button>
        </div>
      ) : correctNetwork ? (
        <div className="container">
          <h1 id="greeting"> HELLO {currentAccount.slice(0, 20)}...</h1>
          <h2> Don't be shy, add away!</h2>
          <form>
            <TextField
              id="outlined-basic"
              label="TASK"
              variant="standard"
              style={{ margin: "0px 5px" }}
              sx={{
                ".css-1c2i806-MuiFormLabel-root-MuiInputLabel-root.Mui-focused":
                  {
                    color: "black",
                  },
                ".css-v4u5dn-MuiInputBase-root-MuiInput-root:after": {
                  color: "black",
                  borderBottom: "black",
                },
              }}
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              style={{
                borderRadius: 35,
                backgroundColor: "#a2ff69",
                color: "black",
                padding: "14px 18px",
                fontSize: "15px",
                fontWeight: "bold",
              }}
              variant="contained"
              onClick={addTask}
            >
              Add
            </Button>
          </form>
          <h4>{`${completedCounter}/${counter}`}</h4>
          <ul>
            {tasks.map(
              (item, index) =>
                item.id && (
                  <Task
                    key={item.id}
                    taskText={item.taskText}
                    status={item.isCompleted}
                    onComplete={completeTask(item.id)}
                    onDelete={deleteTask(item.id)}
                  />
                )
            )}
          </ul>
        </div>
      ) : (
        <div>
          <div>----------------------------------------</div>
          <div>Please connect to the Goerly Testnet</div>
          <div>and reload the page</div>
          <div>----------------------------------------</div>
        </div>
      )}
    </div>
  );
}
// eksportowanie komponentu
export default App;
