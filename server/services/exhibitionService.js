import Exhibition from "../models/Exhibition.js";
import Ticket from "../models/Ticket.js";

class exhibitionService {
    async getCurrentMonthExhibitions() {
        try {
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear();

            const exhibitions = await Exhibition.find({
                month: currentMonth,
                year: currentYear,
                eventDate: { $gte: new Date() },
                status: { $in: ['active', 'sold-out'] }
            })
            .sort({ eventDate: 1 })
            .select('-__v');

            return exhibitions;
        } catch (error) {
            throw new Error(`Failed to fetch current month exhibitions: ${error.message}`);
        }
    }

    async getExhibitionsByMonth(month, year) {
        try {
            const query = {};
            
            if (month && year) {
                query.month = parseInt(month);
                query.year = parseInt(year);
            } else {
                const currentDate = new Date();
                query.month = currentDate.getMonth() + 1;
                query.year = currentDate.getFullYear();
            }

            const exhibitions = await Exhibition.find(query)
                .sort({ eventDate: 1 })
                .select('-__v');

            return exhibitions;
        } catch (error) {
            throw new Error(`Failed to fetch exhibitions: ${error.message}`);
        }
    }

    async getExhibitionById(exhibitionId) {
        try {
            const exhibition = await Exhibition.findById(exhibitionId).select('-__v');
            
            if (!exhibition) {
                throw new Error('Exhibition not found');
            }
            
            return exhibition;
        } catch (error) {
            throw new Error(`Failed to fetch exhibition: ${error.message}`);
        }
    }

    async generateTicketNumber() {
        try {
            const prefix = 'TKT';
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            const ticketNumber = `${prefix}${timestamp}${random}`;

            const existingTicket = await Ticket.findOne({ ticketNumber });
            if (existingTicket) {
                return this.generateTicketNumber();
            }

            return ticketNumber;
        } catch (error) {
            throw new Error(`Failed to generate ticket number: ${error.message}`);
        }
    }

    async updateExhibitionStatus() {
        try {
            const currentDate = new Date();
            
            await Exhibition.updateMany(
                { 
                    eventDate: { $lt: currentDate },
                    status: { $in: ['active', 'sold-out'] }
                },
                { status: 'completed' }
            );
        } catch (error) {
            console.error('Failed to update exhibition status:', error);
        }
    }
}

export default new exhibitionService();