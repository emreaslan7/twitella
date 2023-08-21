import React, { useState } from 'react';
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
  Logout,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setLogin, setLogout, setMode } from 'state';
import { useNavigate } from 'react-router-dom';
import FlexBetween from 'components/FlexBetween';
import UserImage from 'components/UserImage';
import { hover } from '@testing-library/user-event/dist/hover';

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const medium = theme.palette.neutral.medium;
  const main = theme.palette.neutral.main;

  const alt = theme.palette.background.alt;

  const fullName = `${user.firstName} ${user.lastName}`;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      if (query.length > 0) {
        const response = await fetch(
          `https://twitella-api.vercel.app/users?q=${query}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        const data = await response.json();
        setResults(data.data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FlexBetween padding={'1rem 6%'} bgcolor={alt}>
      <FlexBetween gap={'1.75rem'}>
        <Typography
          fontWeight={'bold'}
          fontSize={'clamp(1rem, 2rem, 2.25rem)'}
          color={'primary'}
          onClick={() => navigate('/home')}
          sx={{
            '&hover': {
              color: primaryLight,
              cursor: 'pointer',
            },
          }}
        >
          Twitella
        </Typography>
        {isNonMobileScreens && (
          <Box>
            <Box
              bgcolor={neutralLight}
              borderRadius={'9px'}
              gap={'3rem'}
              padding={'0.1rem 1.5rem'}
            >
              <FlexBetween>
                <InputBase
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                />
                <IconButton onClick={handleSearch}>
                  <Search />
                </IconButton>
              </FlexBetween>
            </Box>
            {results.length > 0 && (
              <Box
                sx={{
                  position: 'fixed',
                  zIndex: 10,
                  listStyle: 'none',
                  backgroundColor: neutralLight,
                  width: '246.163px',
                  borderRadius: '9px',
                  '& .MuiSelect-select:focus': {
                    backgroundColor: neutralLight,
                  },
                }}
              >
                {results.map((user) => (
                  <Box
                    key={user._id}
                    padding={'1rem 6%'}
                    display={'flex'}
                    justifyContent={'flex-start'}
                    alignItems={'center'}
                    gap={'1rem'}
                    sx={{
                      ':hover': {
                        cursor: 'pointer',
                        backgroundColor: medium,
                        borderRadius: '9px',
                      },
                    }}
                    onClick={() => {
                      navigate(`/profile/${user._id}`);
                      navigate(0);
                    }}
                  >
                    <UserImage image={user.picturePath} size="50px" />
                    <Box>
                      <Typography>
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography color={main} fontSize="0.75rem">
                        {user.location}
                      </Typography>
                    </Box>
                    <Divider />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}
        {/* DESKTOP */}
      </FlexBetween>
      {isNonMobileScreens ? (
        <FlexBetween gap={'2rem'}>
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === 'dark' ? (
              <DarkMode sx={{ fontSize: '25px' }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: '25px' }} />
            )}
          </IconButton>
          <Message sx={{ fontSize: '25px' }} />
          <Notifications sx={{ fontSize: '25px' }} />
          <Help sx={{ fontSize: '25px' }} />
          <FormControl variant="standart" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: '150px',
                borderRadius: '0.25rem',
                p: '0.25rem 1rem',
                '& .MuiSvgIcon-root': {
                  pr: '0.25rem',
                  width: '3rem',
                },
                '& .MuiSelect-select:focus': {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position={'fixed'}
          right={'0'}
          bottom={'0'}
          height={'100%'}
          zIndex={'10'}
          maxWidth={'500px'}
          minWidth={'300px'}
          bgcolor={background}
        >
          {/* CLOSE ICON */}
          <Box display={'flex'} justifyContent={'flex-end'} p={'1rem'}>
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            gap={'3rem'}
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: '25px' }}
            >
              {theme.palette.mode === 'dark' ? (
                <DarkMode sx={{ fontSize: '25px' }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: '25px' }} />
              )}
            </IconButton>
            <Message sx={{ fontSize: '25px' }} />
            <Notifications sx={{ fontSize: '25px' }} />
            <Help sx={{ fontSize: '25px' }} />
            <FormControl variant="standart" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: '150px',
                  borderRadius: '0.25rem',
                  p: '0.25rem 1rem',
                  '& .MuiSvgIcon-root': {
                    pr: '0.25rem',
                    width: '3rem',
                  },
                  '& .MuiSelect-select:focus': {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
