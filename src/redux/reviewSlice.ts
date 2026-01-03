import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Review {
    _id: string;
    user: {
        name: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
}

interface ReviewState {
    reviews: Review[];
    loading: boolean;
    error: string | null;
}

const initialState: ReviewState = {
    reviews: [],
    loading: false,
    error: null
}

// Get reviews for a product
export const fetchProductReviews = createAsyncThunk(
    'reviews/fetchProductReviews',
    async (productId: string) => {
        const response = await axios.get(`http://localhost:5000/api/reviews/product/${productId}`);
        return response.data.reviews;
    }
);

// Add new review
export const addReview = createAsyncThunk(
    'reviews/addReview',
    async ({ productId, rating, comment, token }: {
        productId: string;
        rating: number;
        comment: string;
        token: string;
    }, { rejectWithValue }) => {
        try {
            console.log(' Sending review with token:', token ? 'Token present' : 'No token');
            
            const response = await axios.post(
                'http://localhost:5000/api/reviews',
                { productId, rating, comment },
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            return response.data.review;
        } catch (error: any) {
            console.error('Add review error:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || 'Failed to add review');
        }
    }
);

const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        clearReviews: (state) => {
            state.reviews = [];
            state.error = null;
        },
        clearError: (state) => {  
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductReviews.fulfilled, (state, action: PayloadAction<Review[]>) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(fetchProductReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch reviews";
            })
            // Add review cases
            .addCase(addReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addReview.fulfilled, (state, action: PayloadAction<Review>) => {
                state.loading = false;
                state.reviews.unshift(action.payload);
            })
            .addCase(addReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to add review";
            });
    }
});

export const { clearReviews, clearError } = reviewSlice.actions;
export default reviewSlice.reducer;