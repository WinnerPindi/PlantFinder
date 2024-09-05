import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../conf.js'; 
import Cookies from 'js-cookie';
import axios from 'axios';


// Action asynchrone pour se connecter
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post('api/auth/login', credentials);
      const token = response.data.token; 
      // Assurez-vous de récupérer le token correctement
      Cookies.set('access_token', token, { path: '/' });
      localStorage.setItem('token', token);
      console.log("Voici le token : ", response);
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.response.data);
    }
  }
);

// Action asynchrone pour se déconnecter
export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  localStorage.removeItem('profile'); // Supprimez les données de profil stockées localement
  dispatch(clearUser()); // Dispatch une action pour réinitialiser l'utilisateur
});

// Action asynchrone pour mettre à jour les détails de l'utilisateur
export const updateUserDetails = createAsyncThunk(
  'auth/updateUserDetails',
  async ({ id, ...updateData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      console.log("Token d'accès récupéré :", token); // Vérifiez la valeur du token
      if (!token) {
        throw new Error("Aucun token d'accès trouvé");
      }
      console.log(id)
      const response = await axios.put(`http://localhost:8800/api/users/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      console.error("Erreur lors de l'appel API:", err);
      return rejectWithValue(err.response?.data || 'Erreur de mise à jour');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: localStorage.getItem('profile')
      ? JSON.parse(localStorage.getItem('profile'))
      : null,
    message: null,
  },
  reducers: {
    clearUser(state) {
      state.user = null; // Réinitialisez l'état de l'utilisateur
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.user = null;
        state.message = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload; 
        localStorage.setItem('profile', JSON.stringify(action.payload)); // Stockez le profil de l'utilisateur dans le localStorage
      })
      .addCase(login.rejected, (state, action) => {
        state.user = null;
        state.message = action.payload?.message; 
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null; 
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        // Mise à jour réussie, mettez à jour l'état de l'utilisateur avec les nouvelles données
        state.user = { ...state.user, ...action.payload }; 
        localStorage.setItem('profile', JSON.stringify(state.user)); // Mettez à jour localStorage si nécessaire
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        // Gérez l'échec de la mise à jour ici
        console.error("Échec de la mise à jour des détails de l'utilisateur", action.payload);
      });
  },
});

export const { clearUser } = authSlice.actions;

export default authSlice.reducer;
