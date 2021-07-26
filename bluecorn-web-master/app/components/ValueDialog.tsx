import React, { useState, useContext } from 'react';
import {
  Button,
  Dialog,
  TextField,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { CartContext } from '../pages';

type Props = {
  id: number;
  foodName: string;
  image: string;
  open: boolean;
  price: number;
  handleClose: any;
};

const ValueDialog = ({
  id,
  foodName,
  image,
  price,
  open,
  handleClose,
}: Props) => {
  const { cartHandler } = useContext(CartContext);
  const [value, setValue] = useState<any>(null);
  const updateValue = (currentValue: any) => {
    if (Math.sign(currentValue) !== 1) return setError(true);
    setError(false);
    setValue(currentValue);
  };
  const [error, setError] = useState(false);

  const cancel = () => {
    setValue(null);
    const cancelFood = {
      id,
      name: foodName,
      image,
      value: 0,
      price,
    };
    cartHandler(cancelFood);
    handleClose();
  };
  const submit = () => {
    if (Math.sign(value) !== 1) return setError(true);
    const addFood = {
      id,
      name: foodName,
      image,
      value,
      price,
    };
    cartHandler(addFood);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {`${foodName}の数量を入力してください`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <TextField
            defaultValue={value}
            error={error}
            label="数量"
            InputProps={{ inputProps: { min: 1 } }}
            type="number"
            variant="outlined"
            fullWidth
            helperText={error && '数量が入力されていません'}
            onChange={(e) => updateValue(e.target.value)}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancel} color="primary">
          キャンセル
        </Button>
        <Button onClick={submit} color="primary">
          カートに追加
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ValueDialog;
