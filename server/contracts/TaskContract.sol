// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;
/**
 * @title Twitter Contract
 * @dev Store & retrieve value in a variable
 */
contract TaskContract {

    // Zdarzenie dodania zadania
    event AddTask(address recipient, uint taskId);
    // Zdarzenie usunięcia zadania
    event DeleteTask(uint taskId, bool isDeleted);
    // Zdarzenie wykonania zadania
    event CompleteTask(uint taskId, bool isCompleted);

    // Struktura zadania
    struct Task {
        uint id;
        address username;
        string taskText;
        bool isDeleted;
        bool isCompleted;
    }
    // Tablica zadań
    Task[] private tasks;

    // Mapowanie ID zadania na adres użytkownika
    mapping(uint256 => address) taskToOwner;

    // Metoda dodająca nowe zadanie, przyjmuje parametry: taskText - tekst zadania, isDeleted - czy zadanie jest usunięte, isCompleted - czy zadanie jest wykonane.
    function addTask(string memory taskText, bool isDeleted, bool isCompleted) external {
        // Tworzy nowy identyfikator zadania przez długość tablicy zadań.
        uint taskId = tasks.length;
        // Dodaje nowe zadanie do tablicy zadań.
        tasks.push(Task(taskId, msg.sender, taskText, isDeleted, isCompleted));
        // Ustawia mapowanie id zadania na adres użytkownika.
        taskToOwner[taskId] = msg.sender;
        // Emituje zdarzenie AddTask z parametrem adresu użytkownika i id zadania.
        emit AddTask(msg.sender, taskId);
    }

    //Metoda pobierająca tylko twoje zadania, zwraca tablicę zadań w formacie Task.
    function getMyTasks() external view returns (Task[] memory) {
        // Tworzy tymczasową tablicę o długości tablicy zadań.
        Task[] memory temporary = new Task[](tasks.length);
        uint counter = 0;
        // Iteruje po tablicy zadań, jeśli mapowanie id zadania na adres użytkownika jest równe adresowi użytkownika, a zadanie nie jest usunięte, to dodaje zadanie do tablicy tymczasowej i zwiększa licznik.
        for(uint i=0; i<tasks.length; i++) {
            if(taskToOwner[i] == msg.sender && tasks[i].isDeleted == false) {
                temporary[counter] = tasks[i];
                counter++;
            }
        }
        // Tworzy tablicę końcową o długości licznika
        Task[] memory result = new Task[](counter);
        for(uint i=0; i<counter; i++) {
            // Iteruje po tablicy tymczasowej i przypisuje każde zadanie do tablicy końcowej
            result[i] = temporary[i];
        }
        return result;
    }

    //Metoda usuwająca zadanie, przyjmuje parametry: taskId - identyfikator zadania, isDeleted - czy zadanie jest usunięte.
    function deleteTask(uint taskId, bool isDeleted) external {
        if(taskToOwner[taskId] == msg.sender) {
            tasks[taskId].isDeleted = isDeleted;
            emit DeleteTask(taskId, isDeleted);
        }
    }
    // Metoda zmieniająca stan zadania
    function completeTask(uint taskId, bool isCompleted) external {
        // Sprawdza czy mapowanie id zadania na adres użytkownika jest równe adresowi użytkownika.
        if(taskToOwner[taskId] == msg.sender) {
            // Ustawia właściwość isDeleted zadania o danym id na wartość isDeleted.
            tasks[taskId].isCompleted = isCompleted;
            // Emituje zdarzenie DeleteTask z parametrami taskId i isDeleted.
            emit CompleteTask(taskId, isCompleted);
        }
    }
    // Metoda zwracająca liczbę nieusuniętych zadań danego użytkownika, zwraca liczbę całkowitą.
    function getTaskCount() external view returns (uint256){
        uint counter = 0;
        // Iteruje po tablicy zadań, jeśli mapowanie id zadania na adres użytkownika jest równe adresowi użytkownika, a zadanie nie jest usunięte, to zwiększa licznik.
        for(uint i=0; i<tasks.length; i++) {
            if(taskToOwner[i] == msg.sender && tasks[i].isDeleted == false) {
                counter++;
            }
        }
        return counter;

    } 
    // Metoda zwracająca liczbę ukończonych zadań danego użytkownika, zwraca liczbę całkowitą.
    function getCompletedTaskCount() external view returns (uint256){
        uint counter = 0;
        // Iteruje po tablicy zadań, jeśli mapowanie id zadania na adres użytkownika jest równe adresowi użytkownika, a zadanie nie jest usunięte i jest ukończone, to zwiększa licznik.
        for(uint i=0; i<tasks.length; i++) {
            if(taskToOwner[i] == msg.sender && tasks[i].isDeleted == false && tasks[i].isCompleted == true) {
                counter++;
            }
        }
        return counter;

    } 

}