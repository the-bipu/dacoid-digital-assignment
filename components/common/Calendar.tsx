import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { EyeOpenIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

type EventData = {
    name: string;
    startTime: string;
    endTime: string;
    description: string;
    day: string;
    type: string;
};

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentDay, setCurrentDay] = useState<number | null>(null);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [formData, setFormData] = useState<EventData>({
        name: '',
        startTime: '',
        endTime: '',
        description: '',
        day: '',
        type: ''
    });

    const [events, setEvents] = useState<EventData[]>([]);
    const [eventType, setEventType] = useState<string>('');

    const loadEventsFromStorage = () => {
        const storedEvents = localStorage.getItem('events');
        if (storedEvents) {
            setEvents(JSON.parse(storedEvents));
        }
    };

    useEffect(() => {
        loadEventsFromStorage();
    }, []);

    // this get the days in the current month
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // this one get the start day of the month
    const getStartDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    // this one generates the calendar days
    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const daysInMonth = getDaysInMonth(year, month);
        const startDay = getStartDayOfMonth(year, month);

        const calendarDays = [];

        // Add blank days for previous month
        for (let i = 0; i < startDay; i++) {
            calendarDays.push(null);
        }

        // Add days of the current month
        for (let day = 1; day <= daysInMonth; day++) {
            calendarDays.push(day);
        }

        return calendarDays;
    };

    // simple navigation functions to handle next and previous month navigation
    const handlePrevMonth = () => {
        setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const getEventsForDay = (day: number) => {
        return events.filter(event => {
            const eventDay = new Date(event.day).getDate();
            return eventDay === day;
        });
    };

    // for adding new events
    const handleAddEvent = () => {
        if (selectedDay === null) return;

        const event: EventData = {
            ...formData,
            day: `${selectedDay} ${currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}`,
            type: eventType
        };

        const storedEvents = localStorage.getItem('events');
        const events = storedEvents ? JSON.parse(storedEvents) : [];

        events.push(event);
        localStorage.setItem('events', JSON.stringify(events));

        console.log('Toast triggered:', formData.name);
        toast({
            title: `Scheduled: ${formData.name}`,
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{formData.description}</code>
                </pre>
            ),
        })

        loadEventsFromStorage();

        // Reset form and close dialog
        setFormData({ name: '', startTime: '', endTime: '', description: '', day: '', type: '' });
        setEventType('');
        setSelectedDay(null);
    };

    // for deleting existing events
    const handleDeleteEvent = (eventToDelete: EventData) => {
        const updatedEvents = events.filter((event) => event !== eventToDelete);

        // Update state and localStorage
        setEvents(updatedEvents);
        localStorage.setItem('events', JSON.stringify(updatedEvents));

        toast({
            title: `Deleted: ${eventToDelete.name}`,
            description: `Event "${eventToDelete.name}" has been removed.`,
        });
    };

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const calendarDays = generateCalendarDays();

    const isToday = (day: number) => {
        const today = new Date();
        return today.getDate() === day &&
            today.getMonth() === currentDate.getMonth() &&
            today.getFullYear() === currentDate.getFullYear();
    };

    return (
        <div className="w-full h-full flex flex-row">
            <div className={`${currentDay ? 'w-9/12' : 'w-full'} h-full text-center p-8`}>

                <div className='mb-4'>
                    Dynamic Event Calendar Application
                </div>

                <div className="flex justify-between items-center mb-4 gap-4">
                    <Button onClick={handlePrevMonth} variant={'default'}>Previous</Button>
                    <h2 className="text-xl font-bold">
                        {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <Button onClick={handleNextMonth} variant={'default'}>Next</Button>
                </div>
                <div className="grid grid-cols-7 gap-2">

                    {/* Render days of the week */}
                    {daysOfWeek.map((day, index) => (
                        <div key={index} className="font-bold text-gray-700">
                            {day}
                        </div>
                    ))}

                    {/* Render the calendar days */}
                    {calendarDays.map((day, index) => (
                        <div key={index} className={`h-24 p-2 relative flex items-center justify-center border rounded text-2xl text-center cursor-pointer parentCard ${day ? 'bg-white' : 'bg-gray-100'} ${day && isToday(day) ? 'bg-[#67abff]' : ''}`}>
                            {day}

                            {day && (
                                <Dialog
                                    open={selectedDay === day}
                                    onOpenChange={(isOpen) => {
                                        if (!isOpen) setSelectedDay(null);
                                    }}
                                >
                                    <DialogTrigger asChild>
                                        <Button variant={'outline'} onClick={() => setSelectedDay(day)} className='absolute top-2 left-2 border border-slate-300 rounded p-2 childCard'>
                                            <Pencil1Icon />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className='bg-white'>
                                        <DialogHeader>
                                            <DialogTitle>Add New Event for {day} {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}</DialogTitle>
                                            <DialogDescription>
                                                <form className='relative w-full h-full flex flex-col gap-4 mt-4'>

                                                    <div className='flex flex-col'>
                                                        <Label htmlFor="name">Title</Label>
                                                        <Input type="text" name='name' value={formData.name} onChange={handleInputChange} className='bg-white p-2 w-full rounded-lg mt-1 outline-none' required />
                                                    </div>

                                                    <div className='flex flex-col'>
                                                        <Label htmlFor="type" className='mb-2'>Type</Label>
                                                        <Select value={eventType} onValueChange={setEventType}>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="work">Work</SelectItem>
                                                                <SelectItem value="personal">Personal</SelectItem>
                                                                <SelectItem value="others">Others</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className='flex flex-row gap-4'>
                                                        <div className="flex flex-col w-1/2">
                                                            <Label htmlFor="startTime">Start Time</Label>
                                                            <Input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} className="bg-white p-2 w-full rounded-lg mt-1 outline-none" required />
                                                        </div>
                                                        <div className="flex flex-col w-1/2">
                                                            <Label htmlFor="endTime">End Time</Label>
                                                            <Input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} className="bg-white p-2 w-full rounded-lg mt-1 outline-none" required />
                                                        </div>
                                                    </div>

                                                    <div className='flex flex-col'>
                                                        <Label htmlFor="description">Description</Label>
                                                        <Textarea name='description' value={formData.description} onChange={handleInputChange} className='bg-white p-2 w-full rounded-lg mt-1 outline-none' required />
                                                    </div>

                                                    <Button type="button" onClick={handleAddEvent} variant={'default'} className='mt-2'>
                                                        Add
                                                    </Button>
                                                </form>
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            )}

                            {day && (
                                <Button variant={'outline'} className='absolute h-6 bottom-2 left-2 border border-slate-300 rounded px-2 childCard' onClick={() => setCurrentDay(day)}>
                                    {getEventsForDay(day).length} events
                                </Button>
                            )}

                        </div>
                    ))}

                </div>
            </div>

            {currentDay && (
                <div className={`${currentDay ? 'w-3/12' : 'w-0'} h-full p-8 pl-0 flex flex-col items-start justify-center overflow-y-auto`}>

                    {getEventsForDay(currentDay).length > 0 ? (
                        <div className='bg-white w-full'>
                            <div>
                                <div className='mb-4 flex flex-row justify-between'>
                                    <p>Events for this day;</p>
                                    <Button variant={'default'} onClick={() => setCurrentDay(null)} className='mb-4 h-6'>Close</Button>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 flex flex-col gap-4">
                                        {getEventsForDay(currentDay).map((event, idx) => (

                                            <Card key={idx} className='cursor-pointer'>
                                                <CardHeader>
                                                    <CardTitle>{event.name}</CardTitle>
                                                    <CardDescription>{event.description}</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <Button className='h-6' onClick={() => handleDeleteEvent(event)}>Delete</Button>
                                                </CardContent>
                                            </Card>

                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='flex w-full h-full flex-col'>
                            <div className='w-full mb-4 flex flex-row justify-between'>
                                <p> No Events Scheduled;</p>
                                <Button variant={'default'} onClick={() => setCurrentDay(null)} className='mb-4 h-6'>Close</Button>
                            </div>
                            <Card className='cursor-pointer'>
                                <CardHeader>
                                    <CardTitle>Oops</CardTitle>
                                    <CardDescription>Nothing Here</CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};

export default Calendar;