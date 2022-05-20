import { useEffect, useState } from "react";
import "./Snake.css";
import { useTime } from "./hooks/useTime";

const Snake = () => {
  const maxX = 10;
  const maxY = 10;
  const defaultHead = {
    x: 5,
    y: 5,
  };
  const defaultFood = {
    x: 7,
    y: 7,
  };

  const [head, setHead] = useState(defaultHead);
  const [tail, setTail] = useState([defaultHead]);
  const [food, setFood] = useState(defaultFood);
  const [direction, setDirection] = useState("right");
  const [moved, setMoved] = useState(true);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // update snake by `currentTime`, if `paused`, not update currentTime => not update snake
  const currentTime = useTime(paused);

  useEffect(() => {
    // set new tail
    let cloneTail = [...tail];
    let lastTailCell = cloneTail[cloneTail.length - 1];
    cloneTail.unshift(head);
    cloneTail.pop();

    const newHead = generateNewHead();
    if (tail.find((e) => e.x === newHead.x && e.y === newHead.y)) {
      setGameOver(true);
    }
    if (newHead.x === food.x && newHead.y === food.y) {
      setFood(randomFood());
      cloneTail.push(lastTailCell);
    }

    setHead(newHead);
    setTail(cloneTail);
  }, [currentTime]);

  useEffect(() => {
    console.log("useEffect handleKeydown");
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [direction, gameOver]);

  useEffect(() => {
    if (!gameOver) {
      setHead(defaultHead);
      setTail([defaultHead]);
      setFood(defaultFood);
      setDirection("right");
      setPaused(false);
      var popup = document.getElementById("myPopup");
      popup.classList.remove("show");
    } else {
      setPaused(true);
      var popup = document.getElementById("myPopup");
      popup.classList.toggle("show");
    }
  }, [gameOver]);

  const handleKeydown = (e) => {
    console.log("handleKeydown");
    if (gameOver) {
      if (e.keyCode === 32) {
        setGameOver(false);
      }
      return;
    }

    if (moved === false) {
      return;
    }

    let newDirection = direction;
    switch (e.keyCode) {
      case 38:
      case 87:
        if (direction !== "up" && direction !== "down") {
          newDirection = "up";
        }
        break;
      case 40:
      case 83:
        if (direction !== "up" && direction !== "down") {
          newDirection = "down";
        }
        break;
      case 37:
      case 65:
        if (direction !== "left" && direction !== "right") {
          newDirection = "left";
        }
        break;
      case 39:
      case 68:
        if (direction !== "left" && direction !== "right") {
          newDirection = "right";
        }
        break;
    }
    setDirection(newDirection);
  };

  const generateNewHead = () => {
    switch (direction) {
      case "up":
        return {
          x: head.x,
          y: head.y === 1 ? maxY : head.y - 1,
        };
      case "down":
        return {
          x: head.x,
          y: head.y === maxY ? 1 : head.y + 1,
        };
      case "left":
        return {
          x: head.x === 1 ? maxX : head.x - 1,
          y: head.y,
        };
      case "right":
        return {
          x: head.x === maxX ? 1 : head.x + 1,
          y: head.y,
        };
      default:
        return {
          x: head.x,
          y: head.y,
        };
    }
  };

  const randomFood = () => {
    if (tail.length === maxX * maxY - 2) {
      setGameOver(true);
      return;
    }
    let result;
    do {
      result = {
        x: Math.floor(Math.random() * maxX + 1),
        y: Math.floor(Math.random() * maxY + 1),
      };
    } while (tail.find((e) => e.x === result.x && e.y === result.y));
    return result;
  };

  const generateCells = () => {
    let cells = [];

    for (let i = 1; i <= maxY; i++) {
      for (let j = 1; j <= maxX; j++) {
        let isHead = false,
          isFood = false,
          isTail = false;
        if (head.x === j && head.y === i) {
          isHead = true;
        }
        if (food.x === j && food.y === i) {
          isFood = true;
        }
        for (let k = 0; k < tail.length; k++) {
          if (tail[k].x === j && tail[k].y === i) {
            isTail = true;
            break;
          }
        }

        let cellClass;
        if (isHead) {
          cellClass = "snake-head";
        } else if (isTail) {
          cellClass = "snake-tail";
        } else if (isFood) {
          cellClass = "food";
        }

        cells.push(
          <div className="grid-cell" key={`x${j}y${i}`}>
            <div className={`cell ${cellClass}`}></div>
          </div>
        );
      }
    }

    return cells;
  };

  return (
    <>
      <div class="bar">
        <span style={{ marginRight: 40 }}>Use W,A,S,D or arrow to play!</span>
        <span>Length: {tail.length}</span>
        <button
          style={{ float: "right", marginRight: 300 }}
          onMouseDown={() => setPaused(!paused)}
        >
          Pause
        </button>
      </div>
      <div className="grid popup">
        <span class="popuptext" id="myPopup">
          Game over. Press Space to restart.
        </span>
        {head && generateCells()}
      </div>
    </>
  );
};

export default Snake;
