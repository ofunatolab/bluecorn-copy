import React, { createContext, useState, useCallback, useEffect } from 'react';
import Layout from '../components/Layout';
import { Grid, Button } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { GetStaticProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import OrderDialog from '../components/OrderDialog';
import { authorize, insert } from '../utils/spreadSheet';
import { formatDate } from '../utils/formatDate';

const MenuCard = dynamic(() => import('../components/MenuCard'), {
  ssr: false,
});

type Food = {
  id: string;
  name: string;
  shopName: string;
  imageUri: string;
  price: any;
  description: string;
  cookingTime: number;
};
type Foods = Food[];
type Props = {
  foods: Foods;
};

export const CartContext = createContext<any>(undefined);
const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    marginBottom: {
      marginBottom: 70,
    },
    orderButton: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      position: 'fixed',
      borderRadius: 0,
      bottom: 0,
      height: 50,
      color: 'white',
      fontWeight: 'bold',
    },
  })
);

export const getStaticProps: GetStaticProps = async () => {
  // プログラムから GAS の API をコールするためには、オプションとして { redirect : 'follow' } が必須
  const responce = await fetch(
    `${process.env.MENU_API_URL}?auth_key=${process.env.GAS_AUTH_KEY}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
    }
  ).catch((e) => {
    throw Error(e);
  });
  const foods: Foods = await responce.json();

  return {
    props: { foods },
    revalidate: 300, // 5分単位で更新
  };
};

const IndexPage: NextPage<Props> = ({ foods }) => {
  const classes = useStyles();
  const [cart, setCart] = useState<any>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const changeCart: any = useCallback(
    (addFood: any) => {
      const updateCart = [
        ...new Map([...cart, addFood].map((v) => [v.id, v])).values(),
      ];
      setCart(updateCart);
      const priceList = updateCart
        .map((food) => food.value * food.price)
        .reduce((x, y) => x + y);
      setTotalPrice(priceList);
    },
    [cart]
  );

  const cartContextValue = {
    cart,
    cartHandler: changeCart,
    totalPrice,
  };

  const sendMessage = async () => {
    const orderMessage = cart.reduce((acc: any, food: any) => {
      if (food.value === 0) return acc;
      return `${acc}（${food.name} × ${food.value}）\n`;
    }, '');
    const foodMessage = `${orderMessage}合計金額: ${totalPrice.toLocaleString()}円`;
    const customerMessage = `受取人名: ${name}\n受取日: ${formatDate(
      date,
      'yyyy/MM/dd'
    )}\n受取時間: ${formatDate(time, 'HH:mm')}\n電話番号: ${phone}`;
    console.log(`${customerMessage}\n注文内容: ${foodMessage}`);

    try {
      await liff.sendMessages([
        {
          type: 'text',
          text: 'ご注文ありがとうございます。以下の注文を受け付けました。',
        },
        {
          type: 'text',
          text: `${customerMessage}\n注文内容: ${foodMessage}`,
        },
        {
          type: 'text',
          text: 'お受け取りの際は、以下の店舗にお越しください。',
        },
        {
          type: 'location',
          title: 'BLUE CORN',
          address: '〒022-0002 岩手県大船渡市大船渡町茶屋前161-8',
          latitude: 39.06270315452472,
          longitude: 141.7228847380916,
        },
      ]);
      await authorize();
      await insert({
        descriptions: `${customerMessage}\n注文内容: ${foodMessage.trim()}`,
        receiptDate: `${formatDate(date, 'yyyy/MM/dd')} ${formatDate(
          time,
          'HH:mm'
        )}`,
        orderDate: formatDate(new Date(), 'yyyy/MM/dd HH:mm'),
      });
      return liff.closeWindow();
    } catch (error) {
      setOrderDialog(false);
      return window.alert(
        `エラーが発生しました。再度お試しください。\nエラー内容: ${error}`
      );
    }
  };

  const isCart = () => {
    const valueArray = cart.map((food: any) => food.value);
    const isValue = valueArray.filter((value: any) => value !== 0);
    return isValue.length ? true : false;
  };
  const [isDisplayButton, setIsDisplayButton] = useState(isCart);
  useEffect(() => {
    isCart();
    setIsDisplayButton(isCart);
  });
  const [orderDialog, setOrderDialog] = useState(false);
  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const handleSetName = (name: any) => {
    setName(name);
  };
  const handleSetPhone = (phone: any) => {
    setPhone(phone);
  };
  const handleSetDate = (date: any) => {
    setDate(date);
  };
  const handleSetTime = (time: any) => {
    setTime(time);
  };
  const order: any = {
    name,
    setName: handleSetName,
    phone,
    setPhone: handleSetPhone,
    date,
    setDate: handleSetDate,
    time,
    setTime: handleSetTime,
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      <Layout title="BLUE CORNテイクアウト">
        <div
          // @ts-ignore
          className={(classes.root, isDisplayButton && classes.marginBottom)}
        >
          <Grid container spacing={2}>
            {foods.map((food) => (
              <Grid item xs={6} zeroMinWidth key={food.id}>
                <MenuCard food={food} />
              </Grid>
            ))}
            {isDisplayButton && (
              <Button
                variant="contained"
                fullWidth
                startIcon={<ShoppingCartOutlinedIcon />}
                size="large"
                className={classes.orderButton}
                onClick={() => setOrderDialog(true)}
              >
                注文の確認
              </Button>
            )}
          </Grid>
        </div>

        <OrderDialog
          open={orderDialog}
          handleClose={() => setOrderDialog(false)}
          submit={sendMessage}
          order={order}
        />
      </Layout>
    </CartContext.Provider>
  );
};

export default IndexPage;
