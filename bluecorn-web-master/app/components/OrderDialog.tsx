import React, {
  useState,
  useContext,
  forwardRef,
  ReactElement,
  Ref,
} from 'react';
import {
  Button,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Slide,
  Avatar,
  TextField,
  ListItemAvatar,
  ListSubheader,
  CircularProgress,
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  DatePicker,
  TimePicker,
} from '@material-ui/pickers';
import jaLocale from 'date-fns/locale/ja';
import CloseIcon from '@material-ui/icons/Close';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TransitionProps } from '@material-ui/core/transitions';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import { CartContext } from '../pages';
import DateFnsLocale from './DateFnsLocal';

type Props = {
  open: boolean;
  handleClose: any;
  submit: any;
  order: any;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      background: '#eee',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    submit: {
      position: 'fixed',
      borderRadius: 0,
      bottom: 0,
      height: 50,
      fontWeight: 'bold',
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      color: 'white',
    },
    disabled: {
      background: '#eee',
      position: 'fixed',
      borderRadius: 0,
      bottom: 0,
      height: 50,
      fontWeight: 'bold',
    },
    valueField: {
      width: theme.spacing(6),
    },
    inputListLabel: {
      marginTop: -8,
      marginBottom: -12,
    },
    orderListLabel: {
      marginBottom: -25,
    },
    marginBottom: {
      marginBottom: 50,
    },
  })
);

const Transition = forwardRef(
  (props: TransitionProps & { children?: ReactElement }, ref: Ref<unknown>) => (
    <Slide direction="up" ref={ref} {...props} />
  )
);

const OrderDialog = ({ open, handleClose, submit, order }: Props) => {
  const classes = useStyles();
  const { cart, totalPrice } = useContext(CartContext);
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const handleSetName = (name: any) => {
    if (!name) return setNameError(true);
    setNameError(false);
    return order.setName(name);
  };
  const handleSetPhone = (phone: any) => {
    if (!phone) return setPhoneError(true);
    setPhoneError(false);
    return order.setPhone(phone);
  };
  const handleSubmit = async () => {
    if (nameError || !order.name) return setNameError(true);
    if (phoneError || !order.phone) return setPhoneError(true);
    setIsSubmit(true);
    await submit();
    return setIsSubmit(false);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={() => handleClose(false)}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar} color="inherit" position="relative">
        <Toolbar>
          <ShoppingCartOutlinedIcon />
          <Typography variant="h6" className={classes.title}>
            注文の確認
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => handleClose(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <List className={classes.marginBottom}>
        <ListSubheader component="div" className={classes.inputListLabel}>
          入力項目
        </ListSubheader>
        <TextField
          value={order.name}
          label="受取人名"
          variant="filled"
          fullWidth
          required
          onChange={(e) => handleSetName(e.target.value)}
          error={nameError}
          // @ts-ignore
          helperText={
            !nameError
              ? '商品受取時に必要になります'
              : '受取人名が入力されていません'
          }
        />
        <TextField
          value={order.phone}
          label="電話番号"
          variant="filled"
          fullWidth
          required
          onChange={(e) => handleSetPhone(e.target.value)}
          type="tel"
          error={phoneError}
          // @ts-ignore
          helperText={'ハイフンを抜いて入力してください'}
        />
        <MuiPickersUtilsProvider utils={DateFnsLocale} locale={jaLocale}>
          <DatePicker
            label="受取日"
            fullWidth
            inputVariant="filled"
            value={order.date}
            // @ts-ignore
            onChange={order.setDate}
            animateYearScrolling
            okLabel="決定"
            cancelLabel="キャンセル"
            required
            minDate={new Date()}
            format="yyyy/MM/dd"
            helperText="営業時間: 11:00-19:00"
          />
          <TimePicker
            label="受取時間"
            value={order.time}
            // @ts-ignore
            onChange={order.setTime}
            ampm={false}
            fullWidth
            inputVariant="filled"
            okLabel="決定"
            cancelLabel="キャンセル"
            minutesStep={5}
            required
            helperText="定休日: 毎週月曜日 / 毎月第二日曜日"
          />
        </MuiPickersUtilsProvider>
        <Divider />
        <ListSubheader component="div" className={classes.orderListLabel}>
          合計金額
        </ListSubheader>
        <ListItem>
          <ListItemText primary={`${Number(totalPrice).toLocaleString()}円`} />
        </ListItem>
        <ListSubheader component="div" className={classes.orderListLabel}>
          注文した商品
        </ListSubheader>
        {cart.map(
          (food: any) =>
            food.value !== 0 && (
              <>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar variant="square" alt={food.name} src={food.image} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={food.name}
                    secondary={`数量: ${food.value} 金額: ${Number(
                      food.price * Number(food.value)
                    ).toLocaleString()}円`}
                  />
                </ListItem>
              </>
            )
        )}
      </List>
      <Button
        fullWidth
        size="large"
        startIcon={
          isSubmit ? (
            <CircularProgress size={25} />
          ) : (
            <ShoppingCartOutlinedIcon />
          )
        }
        onClick={handleSubmit}
        classes={{ root: classes.submit, disabled: classes.disabled }}
        disabled={isSubmit}
      >
        {isSubmit ? '注文しています' : '注文する'}
      </Button>
    </Dialog>
  );
};

export default OrderDialog;
