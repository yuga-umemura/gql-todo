// https://github.com/mui/material-ui/blob/v5.11.5/docs/data/material/getting-started/templates/sign-up/SignUp.tsx
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMutation } from "@apollo/client";
import { SIGN_IN, SIGN_UP } from "../mutations/authMutations";
import { User } from "../types/user";
import { SignInResponse } from "../types/signInResponse";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

export default function SignUp() {
  // フォームから入力された値をstateで管理
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // authMutations.tsで定義したmutationを使う
  const [signUp] = useMutation<{ createUser: User }>(SIGN_UP); // 型はキーがcreateUserで、値がUser型
  const [signIn] = useMutation<SignInResponse>(SIGN_IN);

  const navigate = useNavigate();

  // フォームが送信された時の処理
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Mutationの引数に渡すためのオブジェクトを作成
    const signUpInput = { name, email, password };
    try {
      const result = await signUp({
        // createUserInputはGraphQL Mutationの引数名、signUpInputはhandleSubmit関数で作成したオブジェクト
        variables: { createUserInput: signUpInput },
      });
      // createUserが成功したら、改めてsignInするのではなく、そのままsignInする
      if (result.data?.createUser) {
        const signInInput = { email, password };
        const result = await signIn({
          variables: { signInInput },
        });
        if (result.data) {
          localStorage.setItem("token", result.data.signIn.accessToken);
        }
        localStorage.getItem("token") && navigate("/");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`ユーザーの作成に失敗しました。: ${err.message}`);
      } else {
        alert("ユーザーの作成に失敗しました。");
      }
      return;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                  value={name} // valueにstateを指定
                  onChange={(e) => setName(e.target.value)} // onChangeでstateを更新
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email} // valueにstateを指定
                  onChange={(e) => setEmail(e.target.value)} // onChangeでstateを更新
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
