import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core';
import ValueDialog from './ValueDialog';
import AlertDialog from './AlertDialog';
import liff from '@line/liff';

type Props = {
  food: Food;
};
type Food = {
  id: string;
  name: string;
  shopName: string;
  imageUri: string;
  price: number;
  description: string;
  cookingTime: number;
};

liff.init({ liffId: process.env.LIFF_ID as string });
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 345,
      color: theme.palette.text.secondary,
    },
    media: {
      height: 120,
    },
    content: {
      height: 140,
    },
    pos: {
      marginBottom: 12,
    },
  })
);

const MenuCard = ({ food }: Props) => {
  const classes = useStyles();
  const [valueDialog, setValueDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);

  const openDialog = () => {
    if (!liff.isInClient()) return setErrorDialog(true);
    return setValueDialog(true);
  };

  return (
    <>
      <Card className={classes.root} onClick={openDialog}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={food.imageUri}
            title={food.name}
          />
          <CardContent className={classes.content}>
            <Typography variant="subtitle1" component="h2">
              {food.name}
            </Typography>
            <Typography paragraph variant="subtitle2" component="p">
              {`${Number(food.price).toLocaleString()}円`}
            </Typography>
            <Typography variant="caption" color="textSecondary" component="p">
              {food.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>

      <ValueDialog
        id={Number(food.id)}
        image={food.imageUri}
        foodName={food.name}
        price={food.price}
        open={valueDialog}
        handleClose={() => setValueDialog(false)}
      />
      <AlertDialog
        open={errorDialog}
        handleClose={() => setErrorDialog(false)}
      />
    </>
  );
};

export default MenuCard;
