import { Affix, Button } from "@mantine/core";
import * as classes from "./KeyControls.css";
import { keyStore, useKeyStore } from "@/stores/keyStore";

const KeyControls = () => {
  const forwardPressed = useKeyStore((state) => state.forwardPressed);
  const backPressed = useKeyStore((state) => state.backPressed);
  const leftPressed = useKeyStore((state) => state.leftPressed);
  const rightPressed = useKeyStore((state) => state.rightPressed);

  return (
    <Affix bottom={16} right={16} className={classes.keyContainer}>
      <div />
      <Button
        color="rgba(255,255,255,0.25)"
        className={classes.key}
        onMouseDown={() => keyStore.setState({ leftPressed: true })}
        onMouseUp={() => keyStore.setState({ leftPressed: false })}
        data-pressed={leftPressed}
      >
        W
      </Button>
      <div />
      <Button
        color="rgba(255,255,255,0.25)"
        className={classes.key}
        onMouseDown={() => keyStore.setState({ backPressed: true })}
        onMouseUp={() => keyStore.setState({ backPressed: false })}
        data-pressed={backPressed}
      >
        A
      </Button>
      <Button
        color="rgba(255,255,255,0.25)"
        className={classes.key}
        onMouseDown={() => keyStore.setState({ rightPressed: true })}
        onMouseUp={() => keyStore.setState({ rightPressed: false })}
        data-pressed={rightPressed}
      >
        S
      </Button>
      <Button
        color="rgba(255,255,255,0.25)"
        className={classes.key}
        onMouseDown={() => keyStore.setState({ forwardPressed: true })}
        onMouseUp={() => keyStore.setState({ forwardPressed: false })}
        data-pressed={forwardPressed}
      >
        D
      </Button>
    </Affix>
  );
};

export default KeyControls;
