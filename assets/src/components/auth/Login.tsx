import React from 'react';
import {RouteComponentProps, Link} from 'react-router-dom';
import {Box, Flex, Image} from 'theme-ui';
import qs from 'query-string';
import {Button, Input, Text, Title} from '../common';
import {useAuth} from './AuthProvider';
import logger from '../../logger';
import loginLogo from '../../login.svg';

type Props = RouteComponentProps & {
  onSubmit: (params: any) => Promise<void>;
};
type State = {
  loading: boolean;
  email: string;
  password: string;
  error: any;
  redirect: string;
};

class Login extends React.Component<Props, State> {
  state: State = {
    loading: false,
    email: '',
    password: '',
    error: null,
    redirect: '/conversations',
  };

  componentDidMount() {
    const {redirect = '/conversations'} = qs.parse(this.props.location.search);

    this.setState({redirect: String(redirect)});
  }

  handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({email: e.target.value});
  };

  handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({password: e.target.value});
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    this.setState({loading: true, error: null});
    const {email, password, redirect} = this.state;

    // TODO: handle login through API
    this.props
      .onSubmit({email, password})
      .then(() => this.props.history.push(redirect))
      .catch((err) => {
        logger.error('Error!', err);
        const error =
          err.response?.body?.error?.message || 'Invalid credentials';

        this.setState({error, loading: false});
      });
  };

  render() {
    const {location} = this.props;
    const {loading, email, password, error} = this.state;

    return (
      <Flex
        px={[2, 5]}
        py={5}
        sx={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 480,
            marginTop: '3rem',
            borderRadius: '10px',
            padding: '4rem 4rem 0 4rem',
            boxShadow: '0px 0px 4px 1px #ccc',
          }}
        >
          <Title style={{textAlign: 'center', fontWeight: 300}} level={1}>
            Sign In
          </Title>
          <form onSubmit={this.handleSubmit}>
            <Box mb={3}>
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                size="large"
                type="email"
                autoComplete="username"
                value={email}
                onChange={this.handleChangeEmail}
              />
            </Box>

            <Box mb={3}>
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                size="large"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={this.handleChangePassword}
              />
            </Box>

            <Box mt={4}>
              <Button
                block
                size="large"
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Log in
              </Button>
            </Box>

            {error && (
              <Box mt={2}>
                <Text type="danger">{error}</Text>
              </Box>
            )}

            {/* <Box mt={error ? 3 : 4}>
              Don't have an account?{' '}
              <Link to={`/register${location.search}`}>Sign up!</Link>
            </Box> */}
            <Box my={3}>
              <Text style={{textAlign: 'center'}}>
                If you have forgotten your password, kindly contact:
                <a href="mailto:akhil.varyani@botcart.co">
                  akhil.varyani@botcart.co
                </a>
              </Text>
            </Box>
            <Box style={{textAlign: 'center', padding: '4rem 0 2rem 0'}}>
              <a
                href="https://botcart.co/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image width={'180px'} src={loginLogo} />
              </a>
            </Box>
          </form>
        </Box>
      </Flex>
    );
  }
}

const LoginPage = (props: RouteComponentProps) => {
  const auth = useAuth();

  return <Login {...props} onSubmit={auth.login} />;
};

export default LoginPage;
