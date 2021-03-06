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
            ???????????????
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
          ????????????
        </ListSubheader>
        <TextField
          value={order.name}
          label="????????????"
          variant="filled"
          fullWidth
          required
          onChange={(e) => handleSetName(e.target.value)}
          error={nameError}
          // @ts-ignore
          helperText={
            !nameError
              ? '???????????????????????????????????????'
              : '??????????????????????????????????????????'
          }
        />
        <TextField
          value={order.phone}
          label="????????????"
          variant="filled"
          fullWidth
          required
          onChange={(e) => handleSetPhone(e.target.value)}
          type="tel"
          error={phoneError}
          // @ts-ignore
          helperText={'????????????????????????????????????????????????'}
        />
        <MuiPickersUtilsProvider utils={DateFnsLocale} locale={jaLocale}>
          <DatePicker
            label="?????????"
            fullWidth
            inputVariant="filled"
            value={order.date}
            // @ts-ignore
            onChange={order.setDate}
            animateYearScrolling
            okLabel="??????"
            cancelLabel="???????????????"
            required
            minDate={new Date()}
            format="yyyy/MM/dd"
            helperText="????????????: 11:00-19:00"
          />
          <TimePicker
            label="????????????"
            value={order.time}
            // @ts-ignore
            onChange={order.setTime}
            ampm={false}
            fullWidth
            inputVariant="filled"
            okLabel="??????"
            cancelLabel="???????????????"
            minutesStep={5}
            required
            helperText="?????????: ??????????????? / ?????????????????????"
          />
        </MuiPickersUtilsProvider>
        <Divider />
        <ListSubheader component="div" className={classes.orderListLabel}>
          ????????????
        </ListSubheader>
        <ListItem>
          <ListItemText primary={`${Number(totalPrice).toLocaleString()}???`} />
        </ListItem>
        <ListSubheader component="div" className={classes.orderListLabel}>
          ??????????????????
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
                    secondary={`??????: ${food.value} ??????: ${Number(
                      food.price * Number(food.value)
                    ).toLocaleString()}???`}
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
        {isSubmit ? '?????????????????????' : '????????????'}
      </Button>
    </Dialog>
  );
};

export default OrderDialog;
