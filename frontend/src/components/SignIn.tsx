// https://github.com/mui/material-ui/blob/v5.11.5/docs/data/material/getting-started/templates/sign-in/SignIn.tsx
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
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { SIGN_IN } from "../mutations/authMutations";
import { SignInResponse } from "../types/signInResponse";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

export default function SignIn() {
  // フォームから入力された値をstateで管理
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // サインインに失敗した時に表示するメッセージを管理
  const [failSignIn, setFailSignIn] = useState(false);
  const [signIn] = useMutation<SignInResponse>(SIGN_IN);

  // It's usually better to use redirect in loaders and actions than this hook
  // リダイレクトするための関数を取得
  const navigate = useNavigate();

  // フォームが送信された時の処理
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const signInInput = { email, password };
    try {
      const result = await signIn({
        variables: { signInInput },
      });
      if (result.data) {
        localStorage.setItem("token", result.data.signIn.accessToken);
      }
      localStorage.getItem("token") && navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === "Unauthorized") {
          setFailSignIn(true);
        }
        console.log(err.message);
        alert("予期せぬエラーが発生しました。");
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
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {failSignIn && (
              <Typography color="error">
                メールアドレスまたはパスワードを確認してください。
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
