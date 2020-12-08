--
-- PostgreSQL database dump
--

-- Dumped from database version 12.4
-- Dumped by pg_dump version 12.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: pomi
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    task_id integer NOT NULL,
    start_timestamp timestamp with time zone,
    end_timestamp timestamp with time zone
);


ALTER TABLE public.sessions OWNER TO pomi;

--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: pomi
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sessions_id_seq OWNER TO pomi;

--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pomi
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: sessions_task_id_seq; Type: SEQUENCE; Schema: public; Owner: pomi
--

CREATE SEQUENCE public.sessions_task_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sessions_task_id_seq OWNER TO pomi;

--
-- Name: sessions_task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pomi
--

ALTER SEQUENCE public.sessions_task_id_seq OWNED BY public.sessions.task_id;


--
-- Name: sessions_user_id_seq; Type: SEQUENCE; Schema: public; Owner: pomi
--

CREATE SEQUENCE public.sessions_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sessions_user_id_seq OWNER TO pomi;

--
-- Name: sessions_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pomi
--

ALTER SEQUENCE public.sessions_user_id_seq OWNED BY public.sessions.user_id;


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: pomi
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character(1)
);


ALTER TABLE public.tasks OWNER TO pomi;

--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: pomi
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tasks_id_seq OWNER TO pomi;

--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pomi
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- Name: tasks_user_id_seq; Type: SEQUENCE; Schema: public; Owner: pomi
--

CREATE SEQUENCE public.tasks_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tasks_user_id_seq OWNER TO pomi;

--
-- Name: tasks_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pomi
--

ALTER SEQUENCE public.tasks_user_id_seq OWNED BY public.tasks.user_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: pomi
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character(1) NOT NULL
);


ALTER TABLE public.users OWNER TO pomi;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: pomi
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO pomi;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pomi
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: version; Type: TABLE; Schema: public; Owner: pomi
--

CREATE TABLE public.version (
    value integer
);


ALTER TABLE public.version OWNER TO pomi;

--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: pomi
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: sessions user_id; Type: DEFAULT; Schema: public; Owner: pomi
--

ALTER TABLE ONLY public.sessions ALTER COLUMN user_id SET DEFAULT nextval('public.sessions_user_id_seq'::regclass);


--
-- Name: sessions task_id; Type: DEFAULT; Schema: public; Owner: pomi
--

ALTER TABLE ONLY public.sessions ALTER COLUMN task_id SET DEFAULT nextval('public.sessions_task_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: pomi
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Name: tasks user_id; Type: DEFAULT; Schema: public; Owner: pomi
--

ALTER TABLE ONLY public.tasks ALTER COLUMN user_id SET DEFAULT nextval('public.tasks_user_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: pomi
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: pomi
--

COPY public.sessions (id, user_id, task_id, start_timestamp, end_timestamp) FROM stdin;
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: pomi
--

COPY public.tasks (id, user_id, title) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: pomi
--

COPY public.users (id, username) FROM stdin;
\.


--
-- Data for Name: version; Type: TABLE DATA; Schema: public; Owner: pomi
--

COPY public.version (value) FROM stdin;
2
\.


--
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pomi
--

SELECT pg_catalog.setval('public.sessions_id_seq', 1, false);


--
-- Name: sessions_task_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pomi
--

SELECT pg_catalog.setval('public.sessions_task_id_seq', 1, false);


--
-- Name: sessions_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pomi
--

SELECT pg_catalog.setval('public.sessions_user_id_seq', 1, false);


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pomi
--

SELECT pg_catalog.setval('public.tasks_id_seq', 1, false);


--
-- Name: tasks_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pomi
--

SELECT pg_catalog.setval('public.tasks_user_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pomi
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: pomi
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: pomi
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id, user_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: pomi
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_task_id_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pomi
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_task_id_user_id_fkey FOREIGN KEY (task_id, user_id) REFERENCES public.tasks(id, user_id);


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pomi
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: tasks tasks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pomi
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

